<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import NavAdmin from '@/views/Dashboard/NavAdmin.vue'

const sidebarOpen = ref(false)
const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value }
const closeSidebar = () => { sidebarOpen.value = false }

const router = useRouter()
const goBack = () => router.back()

// Data Barang Masuk
const barangMasuk = ref([])
const isLoading = ref(true)

const fetchBarangMasuk = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('https://cvindahbaru.com/api/api/barangmsk')
    console.log('Data barang masuk:', response.data)
    barangMasuk.value = response.data // <-- Perbaikan utama
  } catch (error) {
    console.error('Gagal ambil data barang masuk:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchBarangMasuk)
</script>

<template>
  <div class="w-full min-h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Header Mobile -->
    <div class="md:hidden flex justify-between items-center bg-indigo-600 text-white px-4 py-3 shadow-md">
      <h1 class="text-lg font-semibold">Riwayat Barang Masuk</h1>
      <button @click="toggleSidebar">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <div :class="[ 'bg-white w-3/4 max-w-xs h-full fixed top-0 left-0 z-50 transition-transform duration-300', sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'md:translate-x-0 md:relative md:block md:w-1/5 md:h-screen md:z-0' ]">
      <div class="md:hidden p-4">
        <button @click="closeSidebar" class="text-gray-600 hover:text-indigo-800">
          <fa icon="fas fa-arrow-left" class="w-5 h-5 mr-2" />
          Tutup Menu
        </button>
      </div>
      <NavAdmin />
    </div>

    <!-- Content -->
    <div class="w-full md:w-4/5 py-6 px-4 md:px-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
        Riwayat Barang Masuk
      </h1>

      <!-- Filter Tanggal -->
      <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-4">
        <div class="flex flex-col sm:flex-row gap-2 sm:items-end w-full sm:w-auto">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
            <input type="date" class="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-48 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
            <input type="date" class="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-48 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition w-full sm:w-auto">
          Filter
        </button>
      </div>

      <!-- Tabel -->
      <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
        <table class="min-w-full bg-white text-sm md:text-base text-left text-gray-700">
          <thead class="bg-indigo-600 text-white text-xs md:text-sm uppercase">
            <tr>
              <th class="px-4 md:px-6 py-3">ID</th>
              <th class="px-4 md:px-6 py-3">Barang</th>
              <th class="px-4 md:px-6 py-3">Ekspedisi</th>
              <th class="px-4 md:px-6 py-3">Qty</th>
              <th class="px-4 md:px-6 py-3">Tanggal Masuk</th>
              <th class="px-4 md:px-6 py-3">Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center py-4 text-gray-500">Memuat data...</td>
            </tr>
            <template v-else-if="barangMasuk.length === 0">
              <tr>
                <td colspan="6" class="text-center py-4 text-gray-500">Belum ada data barang masuk.</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="data in barangMasuk" :key="data.id_msk" class="border-b hover:bg-gray-50">
                <td class="px-4 md:px-6 py-3 font-medium text-gray-900">{{ data.id_msk }}</td>
                <td class="px-4 md:px-6 py-3">{{ data.barang?.nm_brg || '-' }}</td>
                <td class="px-4 md:px-6 py-3">{{ data.expedisi?.nm_exp || '-' }}</td>
                <td class="px-4 md:px-6 py-3">{{ data.qty_msk }}</td>
                <td class="px-4 md:px-6 py-3">{{ data.tgl_msk }}</td>
                <td class="px-4 md:px-6 py-3">{{ data.desk_msk }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Tombol Tambah -->
      <div class="relative mt-10">
        <div class="fixed bottom-0 left-0 md:left-[20%] w-full md:w-[80%] z-50">
          <router-link to="/UserAdmin/Barang/FormMsk" class="block w-full text-center bg-indigo-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-none shadow-md transition duration-300">
            Tambah Barang Masuk
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
