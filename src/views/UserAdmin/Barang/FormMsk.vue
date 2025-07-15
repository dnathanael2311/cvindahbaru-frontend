<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const router = useRouter()
const goBack = () => router.back()

// State
const daftarBarang = ref([])
const daftarEkspedisi = ref([])

const barangDipilih = ref(null)
const ekspedisiDipilih = ref('')
const tanggalMasuk = ref('')
const qty = ref(1)
const deskripsi = ref('')

// Ambil semua barang dari API Laravel
const getBarang = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/barangmsk/get-all-barang')
    daftarBarang.value = res.data
  } catch (error) {
    console.error('Gagal mengambil data barang:', error)
  }
}

// Ambil ekspedisi dari API Laravel
const getEkspedisi = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/expedisi')
    daftarEkspedisi.value = res.data
  } catch (error) {
    console.error('Gagal mengambil data ekspedisi:', error)
  }
}

// Pilih barang dari daftar
const pilihBarang = (barang) => {
  barangDipilih.value = barang
  tanggalMasuk.value = ''
  qty.value = 1
  deskripsi.value = ''
  ekspedisiDipilih.value = ''
}

// Kirim barang masuk ke API Laravel

const tambahBarangMasuk = async () => {
  if (!barangDipilih.value || !tanggalMasuk.value || !qty.value || !ekspedisiDipilih.value) {
    alert('Harap lengkapi semua field')
    return
  }

  try {
    const res = await axios.post('http://localhost:8000/api/barangmsk/add', {
      id_brg: barangDipilih.value.id_brg,
      tgl_msk: tanggalMasuk.value,
      qty_msk: qty.value,
      desk_msk: deskripsi.value,
      id_exp: ekspedisiDipilih.value
    })

    alert(res.data.message)
    barangDipilih.value = null
  } catch (error) {
    alert(error.response?.data?.message || 'Terjadi kesalahan')
  }
}

onMounted(() => {
  getBarang()
  getEkspedisi()
})
</script>

<template>
  <div class="w-full min-h-screen bg-[#000C] backdrop-blur-md flex justify-center items-start pt-10 px-4 pb-10 overflow-auto">
    <div class="w-full max-w-3xl bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-lg sm:text-xl font-bold text-gray-800">Tambah Barang Masuk</h1>
        <button @click="goBack" class="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium">
          ← Kembali
        </button>
      </div>

      <!-- Tabel Barang -->
      <div class="overflow-x-auto border border-gray-200 rounded-lg mb-6">
        <table class="min-w-full text-left text-sm text-gray-700">
          <thead class="bg-indigo-600 text-white uppercase text-xs sm:text-sm">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Nama</th>
              <th class="px-4 py-3">Kategori</th>
              <th class="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="barang in daftarBarang" :key="barang.id_brg" class="border-b hover:bg-gray-100">
              <td class="px-4 py-3">{{ barang.id_brg }}</td>
              <td class="px-4 py-3">{{ barang.nm_brg }}</td>
              <td class="px-4 py-3">{{ barang.kategori?.nm_ktg || '-' }}</td>
              <td class="px-4 py-3 text-center">
              <button @click="pilihBarang(barang)" class="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded-md text-sm">
                Pilih
              </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detail Form -->
      <div v-if="barangDipilih" class="bg-gray-50 border border-indigo-200 rounded-lg p-4">
        <h2 class="text-sm sm:text-base font-semibold text-indigo-700 mb-3">Detail Barang</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
          <div><strong>ID:</strong> {{ barangDipilih.id_brg }}</div>
          <div><strong>Nama:</strong> {{ barangDipilih.nm_brg }}</div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-medium mb-1">Tanggal Masuk</label>
            <input v-model="tanggalMasuk" type="date" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block font-medium mb-1">Qty Masuk</label>
            <input v-model="qty" type="number" min="1" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div class="sm:col-span-2">
            <label class="block font-medium mb-1">Deskripsi</label>
            <textarea v-model="deskripsi" rows="2" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"></textarea>
          </div>
          <div class="sm:col-span-2">
            <label class="block font-medium mb-1">Ekspedisi</label>
            <select v-model="ekspedisiDipilih" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="" disabled>Pilih ekspedisi</option>
              <option v-for="exp in daftarEkspedisi" :key="exp.id_exp" :value="exp.id_exp">
                {{ exp.nm_exp }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-center mt-6">
          <button @click="tambahBarangMasuk" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold transition">
            Tambah
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
