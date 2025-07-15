<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import NavAdmin from '@/views/Dashboard/NavAdmin.vue'

const sidebarOpen = ref(false)
const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value }
const closeSidebar = () => { sidebarOpen.value = false }

const router = useRouter()
const returList = ref([])
const isLoading = ref(true)

const fetchRetur = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('http://localhost:8000/api/retur')
    returList.value = response.data
  } catch (error) {
    console.error('Gagal memuat data retur:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchRetur)
</script>

<template>
  <div class="w-full min-h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Header Mobile -->
    <div class="md:hidden flex justify-between items-center bg-indigo-600 text-white px-4 py-3 shadow-md">
      <h1 class="text-lg font-semibold">Retur Masuk</h1>
      <button @click="toggleSidebar">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Overlay Mobile -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <div :class="[
      'bg-white w-3/4 max-w-xs h-full fixed top-0 left-0 z-50 transition-transform duration-300',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0 md:relative md:block md:w-1/5 md:h-screen md:z-0'
    ]">
      <div class="md:hidden p-4">
        <button @click="closeSidebar" class="text-gray-600 hover:text-indigo-800">Tutup Menu</button>
      </div>
      <NavAdmin />
    </div>

    <!-- Content -->
    <div class="w-full md:w-4/5 py-6 px-4 md:px-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Retur Masuk</h1>

      <!-- Tabel Retur -->
      <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
        <table class="min-w-full text-sm md:text-base text-left text-gray-700">
          <thead class="bg-indigo-600 text-white text-xs md:text-sm uppercase">
            <tr>
              <th class="px-4 md:px-6 py-3">ID</th>
              <th class="px-4 md:px-6 py-3">ID Order</th>
              <th class="px-4 md:px-6 py-3">Nama Pelanggan</th>
              <th class="px-4 md:px-6 py-3">Tanggal Permintaan</th>
              <th class="px-4 md:px-6 py-3">Statusn</th>
              <th class="px-4 md:px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="text-center py-4 text-gray-500">Memuat data...</td>
            </tr>

            <tr v-for="retur in returList" :key="retur.id_rt" class="border-b hover:bg-gray-50">
              <td class="px-4 md:px-6 py-4 font-medium text-gray-900">{{ retur.id_rt }}</td>
              <td class="px-4 md:px-6 py-4">{{ retur.id_order }}</td>
              <td class="px-4 md:px-6 py-4">{{ retur.order?.checkout?.pelanggan?.nm_plg || '-' }}</td>
              <td class="px-4 md:px-6 py-4">{{ retur.tgl_rt }}</td>
              <td class="px-4 md:px-6 py-4">{{ retur.st_retur }}</td>
              <td class="px-4 md:px-6 py-4">
                  <router-link
                    :to="`/UserAdmin/AdminRetur/ReturDetail?id_rt=${retur.id_rt}`"
                    class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md shadow-md transition text-sm"
                  >
                    Lihat Detail
                  </router-link>
              </td>
            </tr>

            <tr v-if="!isLoading && returList.length === 0">
              <td colspan="5" class="text-center py-4 text-gray-500">Tidak ada data retur.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
