<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

// Router
const route = useRoute()
const router = useRouter()
const goBack = () => router.back()

// State
const idRetur = route.query.id_rt
const detailRetur = ref([])
const alasanRetur = ref('')
const isLoading = ref(true)

// Alert helper
const showAlert = (message) => window.alert(message)

// Ambil data detail retur
const fetchDetailRetur = async () => {
  if (!idRetur) return console.error('ID Retur tidak tersedia di route.query')

  isLoading.value = true
  try {
    const { data: detailData } = await axios.get('https://cvindahbaru.com/api/api/detailretur/byretur', {
      params: { id_rt: idRetur }
    })
    detailRetur.value = detailData
    alasanRetur.value = detailData[0]?.alasan || 'Tidak ada alasan retur'
  } catch (err) {
    console.error('Gagal mengambil data retur:', err)
    showAlert('Gagal mengambil data retur.')
  } finally {
    isLoading.value = false
  }
}

// Update status retur
const updateStatusRetur = async (status) => {
  if (!idRetur) return showAlert('ID retur tidak tersedia.')

  try {
    await axios.post('https://cvindahbaru.com/api/api/retur/update', {
      id_rt: idRetur,
      st_retur: status
    })
    showAlert(`Retur berhasil ${status === 'diterima' ? 'diterima' : 'ditolak'}.`)
    router.push('/UserAdmin/AdminRetur/ReturMsk')
  } catch (err) {
    console.error('Gagal update status retur:', err)
    showAlert('Terjadi kesalahan saat memperbarui status retur.')
  }
}

// Aksi tombol
const tolakRetur = () => {
  if (window.confirm('Apakah Anda yakin ingin *menolak* retur ini?')) {
    updateStatusRetur('ditolak')
  }
}

const terimaRetur = () => {
  if (window.confirm('Apakah Anda yakin ingin *menerima* retur ini?')) {
    updateStatusRetur('diterima')
  }
}


onMounted(fetchDetailRetur)
</script>

<template>
  <div class="w-screen min-h-screen overflow-auto">
    <div class="w-full min-h-screen flex justify-center items-center bg-[#000C] z-10 absolute top-0 left-0 backdrop-blur-md px-4">
      <div class="w-full sm:w-4/5 md:w-3/4 lg:w-1/2 bg-white py-6 px-5 flex flex-col items-center rounded-lg shadow-lg">
        <div class="w-full p-4 md:p-6 lg:p-10">
          <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
            Detail Barang Retur
          </h1>

          <button @click="goBack" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-4">
            ← Kembali
          </button>

          <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200 mb-6">
            <table class="min-w-full bg-white text-sm md:text-base text-left text-gray-700">
              <thead class="bg-indigo-600 text-white text-xs md:text-sm uppercase">
                <tr>
                  <th class="px-4 md:px-6 py-3">ID</th>
                  <th class="px-4 md:px-6 py-3">Nama Barang</th>
                  <th class="px-4 md:px-6 py-3">Qty</th>
                  <th class="px-4 md:px-6 py-3">Satuan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="4" class="text-center py-4 text-gray-500">Memuat data...</td>
                </tr>
                <tr v-else-if="detailRetur.length === 0">
                  <td colspan="4" class="text-center py-4 text-gray-500">Tidak ada data retur ditemukan.</td>
                </tr>
                <tr v-for="(item, index) in detailRetur" :key="index" class="border-t hover:bg-gray-50">
                  <td class="px-4 md:px-6 py-3">{{ item.id_brg }}</td>
                  <td class="px-4 md:px-6 py-3">{{ item.barang?.nm_brg || '-' }}</td>
                  <td class="px-4 md:px-6 py-3">{{ item.qty_rt }}</td>
                  <td class="px-4 md:px-6 py-3">{{ item.barang?.satuan_brg || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mb-6 w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">Alasan Retur:</label>
            <textarea
              readonly
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 resize-none"
              rows="4"
            >{{ alasanRetur }}</textarea>
          </div>

          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button
              @click="tolakRetur"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              Tolak Retur
            </button>
            <button
              @click="terimaRetur"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              Terima Retur
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
