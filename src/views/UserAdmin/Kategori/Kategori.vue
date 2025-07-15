<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import NavAdmin from '@/views/Dashboard/NavAdmin.vue'

const router = useRouter()
const sidebarOpen = ref(false)
const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)
const closeSidebar = () => (sidebarOpen.value = false)

const kategoriList = ref([])
const loading = ref(true)

const fetchKategori = async () => {
  try {
    const response = await axios.get('https://cvindahbaru.com/api/api/kategori')
    kategoriList.value = response.data
  } catch (error) {
    console.error('Gagal fetch kategori:', error)
  } finally {
    loading.value = false
  }
}

const deleteKategori = async (id_ktg) => {
  try {
    await axios.post('https://cvindahbaru.com/api/api/kategori/delete', { id_ktg })
    kategoriList.value = kategoriList.value.filter(k => k.id_ktg !== id_ktg)
  } catch (error) {
    alert('Gagal hapus kategori.')
    console.error(error)
  }
}

onMounted(() => {
  fetchKategori()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Mobile -->
    <div class="md:hidden flex justify-between items-center bg-indigo-600 text-white px-4 py-3 shadow-md">
      <h1 class="text-lg font-semibold">Data Kategori</h1>
      <button @click="toggleSidebar">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Sidebar Mobile -->
    <transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" @click.self="closeSidebar">
        <div class="bg-white w-3/4 h-full p-4 shadow-lg">
          <button @click="closeSidebar" class="mb-4 text-gray-600 hover:text-indigo-800 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9l-4-4m0 0l4 4m-4-4v10" clip-rule="evenodd" />
            </svg>
            Tutup Menu
          </button>
          <NavAdmin />
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <div class="flex flex-col md:flex-row min-h-screen">
      <div class="hidden md:block md:w-1/5 bg-white shadow-md">
        <NavAdmin />
      </div>

      <div class="w-full md:w-4/5 py-6 px-4 md:px-6">
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
          Daftar Kategori
        </h1>

        <!-- Search -->
        <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-6 max-w-md">
          <input type="text" placeholder="Cari kategori..." class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Cari</button>
        </div>

        <!-- Tabel Kategori -->
        <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
          <table class="min-w-full text-sm md:text-base text-left text-gray-700">
            <thead class="bg-indigo-600 text-white text-xs md:text-sm uppercase">
              <tr>
                <th class="px-4 md:px-6 py-3">ID</th>
                <th class="px-4 md:px-6 py-3">Kategori</th>
                <th class="px-4 md:px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody v-if="!loading && kategoriList.length > 0">
              <tr v-for="kategori in kategoriList" :key="kategori.id_ktg" class="border-b hover:bg-gray-50">
                <td class="px-4 md:px-6 py-3 font-medium text-gray-900">{{ kategori.id_ktg }}</td>
                <td class="px-4 md:px-6 py-3">{{ kategori.nm_ktg }}</td>
                <td class="px-4 md:px-6 py-3 flex flex-col md:flex-row gap-1">
                  <router-link
                    :to="`/UserAdmin/Kategori/KategoriEdit?id=${kategori.id_ktg}`"
                    class="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 text-center">
                    Edit
                  </router-link>
                  <button
                    @click="deleteKategori(kategori.id_ktg)"
                    class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 text-center">
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center px-4 py-6 text-gray-500">
                  {{ loading ? 'Memuat data...' : 'Tidak ada data kategori.' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tombol Tambah -->
        <div class="relative mt-10">
          <div class="fixed bottom-0 left-0 md:left-[20%] w-full md:w-[80%] z-50">
            <router-link to="/UserAdmin/Kategori/KategoriTbh" class="block w-full text-center bg-indigo-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-none shadow-md transition duration-300">
              Tambah Kategori
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
