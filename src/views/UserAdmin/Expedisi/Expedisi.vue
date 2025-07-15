<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import NavAdmin from '@/views/Dashboard/NavAdmin.vue'

const sidebarOpen = ref(false)
const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)
const closeSidebar = () => (sidebarOpen.value = false)

const router = useRouter()
const goBack = () => router.back()

const expedisiList = ref([])
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/expedisi') // pastikan URL benar
    console.log('Data Expedisi:', res.data) // 👈 CEK DI CONSOLE
    expedisiList.value = res.data
  } catch (error) {
    console.error('Gagal fetch data expedisi:', error)
  }
})
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    const res = await axios.get('/api/expedisi/expedisi')
    expedisiList.value = res.data
  } catch (e) {
    console.error('Gagal:', e)
  } finally {
    isLoading.value = false
  }
})

const editExpedisi = (id) => {
  router.push({ path: '/UserAdmin/Expedisi/ExpedisiEdit', query: { id_exp: id } })
}

const deleteExpedisi = async (id) => {
  if (confirm('Yakin ingin menghapus data ini?')) {
    try {
      await axios.post('/api/expedisi/delete', { id_exp: id })
      expedisiList.value = expedisiList.value.filter(e => e.id_exp !== id)
    } catch (err) {
      alert('Gagal menghapus data')
    }
  }
}
</script>

<template>
  <div class="w-full min-h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Topbar Mobile -->
    <div class="md:hidden flex justify-between items-center bg-indigo-600 text-white px-4 py-3 shadow-md">
      <h1 class="text-lg font-semibold">Daftar Expedisi</h1>
      <button @click="toggleSidebar">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Sidebar -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="closeSidebar"></div>
    <div :class="['bg-white w-3/4 max-w-xs h-full fixed top-0 left-0 z-50 transition-transform duration-300', sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'md:translate-x-0 md:relative md:block md:w-1/5 md:h-screen']">
      <div class="md:hidden p-4">
        <button @click="closeSidebar" class="text-gray-600 hover:text-indigo-800">Tutup Menu</button>
      </div>
      <NavAdmin />
    </div>

    <!-- Content -->
    <div class="w-full md:w-4/5 py-6 px-4 md:px-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">Daftar Expedisi</h1>

      <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-6 max-w-md">
        <input type="text" placeholder="Cari ekspedisi..." class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Cari</button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
        <table class="min-w-full text-sm md:text-base text-left text-gray-700">
          <thead class="bg-indigo-600 text-white text-xs md:text-sm uppercase">
            <tr>
              <th class="px-4 md:px-6 py-3">ID</th>
              <th class="px-4 md:px-6 py-3">Nama Expedisi</th>
              <th class="px-4 md:px-6 py-3">No. Telp</th>
              <th class="px-4 md:px-6 py-3">Email</th>
              <th class="px-4 md:px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-4 text-center">Memuat data...</td>
            </tr>
            <tr v-for="item in expedisiList" :key="item.id_exp" class="border-b hover:bg-gray-50">
              <td class="px-4 md:px-6 py-3 font-medium text-gray-900">{{ item.id_exp }}</td>
              <td class="px-4 md:px-6 py-3">{{ item.nm_exp }}</td>
              <td class="px-4 md:px-6 py-3">{{ item.no_exp }}</td>
              <td class="px-4 md:px-6 py-3">{{ item.email_exp }}</td>
              <td class="px-4 md:px-6 py-3 flex flex-col md:flex-row gap-1">
                <button @click="editExpedisi(item.id_exp)" class="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition text-center">
                  Edit
                </button>
                <button @click="deleteExpedisi(item.id_exp)" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition text-center">
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="!isLoading && expedisiList.length === 0">
              <td colspan="5" class="text-center px-6 py-4 text-gray-500">Data tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tombol Tambah -->
      <div class="relative mt-10">
        <div class="fixed bottom-0 left-0 md:left-[20%] w-full md:w-[80%] z-50">
          <router-link to="/UserAdmin/Expedisi/ExpedisiTbh" class="block w-full text-center bg-indigo-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-none shadow-md transition duration-300">
            Tambah Expedisi
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
