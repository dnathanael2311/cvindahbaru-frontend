<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ref, onMounted } from 'vue'

const router = useRouter()
const goBack = () => router.back()

// State
const daftarBarang = ref([])
const barangDipilih = ref(null)
const qtyKeluar = ref(1)
const tglKeluar = ref('')
const deskripsi = ref('')

// Ambil semua barang
const getBarang = async () => {
  try {
    const res = await axios.get('https://cvindahbaru.com/api/api/barangmsk/get-all-barang')
    daftarBarang.value = res.data
  } catch (err) {
    console.error('Gagal mengambil data barang:', err)
  }
}

// Pilih barang
const pilihBarang = (barang) => {
  barangDipilih.value = barang
  qtyKeluar.value = 1
  tglKeluar.value = ''
  deskripsi.value = ''
}

// Submit barang keluar
const tambahBarangKeluar = async () => {
  if (!barangDipilih.value || !qtyKeluar.value || !tglKeluar.value) {
    return alert('Lengkapi semua field terlebih dahulu')
  }

  try {
    const res = await axios.post('https://cvindahbaru.com/api/api/barangklr/add', {
      id_brg: barangDipilih.value.id_brg,
      qty_klr: qtyKeluar.value,
      tgl_klr: tglKeluar.value,
      desk_klr: deskripsi.value
    })

    alert(res.data.message)
    barangDipilih.value = null
  } catch (err) {
    alert(err.response?.data?.message || 'Terjadi kesalahan')
  }
}

onMounted(getBarang)
</script>

<template>
  <div class="w-full min-h-screen bg-[#000C] backdrop-blur-md flex justify-center items-start pt-10 px-4 pb-10 overflow-auto">
    <div class="w-full max-w-3xl bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-lg sm:text-xl font-bold text-gray-800">Tambah Barang Keluar</h1>
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
          <div><strong>Stok Tersedia:</strong> {{ barangDipilih.stok }}</div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-medium mb-1">Tanggal Keluar</label>
            <input v-model="tglKeluar" type="date" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block font-medium mb-1">Qty Keluar</label>
            <input v-model="qtyKeluar" type="number" :max="barangDipilih.stok" min="1" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div class="sm:col-span-2">
            <label class="block font-medium mb-1">Deskripsi</label>
            <textarea v-model="deskripsi" rows="2" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"></textarea>
          </div>
        </div>

        <div class="flex justify-center mt-6">
          <button @click="tambahBarangKeluar" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold transition">
            Tambah
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
