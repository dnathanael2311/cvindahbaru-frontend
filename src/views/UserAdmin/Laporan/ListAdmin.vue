<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import NavAdmin from '@/views/Dashboard/NavAdmin.vue'

const router = useRouter()
const sidebarOpen = ref(false)
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value
const closeSidebar = () => sidebarOpen.value = false

const adminList = ref([])
const isLoading = ref(true)

async function fetchAdmin() {
  isLoading.value = true
  try {
    const res = await axios.get('https://cvindahbaru.com/api/api/admin')
    adminList.value = res.data
  } catch (error) {
    console.error('Gagal ambil data admin:', error)
  } finally {
    isLoading.value = false
  }
}

async function deleteAdmin(id_adm) {
  if (id_adm === 1) {
    alert('Admin utama tidak dapat dihapus.')
    return
  }

  if (confirm('Yakin ingin menghapus admin ini?')) {
    try {
      await axios.post('https://cvindahbaru.com/api/api/admin/delete', { id_adm })
      alert('Admin berhasil dihapus.')
      await fetchAdmin()
    } catch (error) {
      console.error('Gagal hapus admin:', error)
      alert('Gagal menghapus admin.')
    }
  }
}

const editAdmin = (admin) => {
  router.push({ path: '/UserAdmin/Admin/AdminEdit', query: { id_adm: admin.id_adm } })
}

onMounted(fetchAdmin)
</script>

<template>
  <div class="w-full min-h-screen flex flex-col md:flex-row bg-gray-50">
    <div class="md:hidden flex justify-between items-center bg-indigo-600 text-white px-4 py-3 shadow-md">
      <h1 class="text-lg font-semibold">Data Admin</h1>
      <button @click="toggleSidebar">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="closeSidebar"></div>
    <div :class="[ 'bg-white w-3/4 max-w-xs h-full fixed top-0 left-0 z-50 transition-transform duration-300', sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'md:translate-x-0 md:relative md:block md:w-1/5 md:h-screen md:z-0' ]">
      <div class="md:hidden p-4">
        <button @click="closeSidebar" class="text-gray-600 hover:text-indigo-800">
          Tutup Menu
        </button>
      </div>
      <NavAdmin />
    </div>

    <div class="w-full md:w-4/5 py-6 px-4 md:px-6">
      <h1 class="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left">Daftar Admin</h1>

      <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
        <table class="min-w-full text-sm md:text-base text-left text-gray-700">
          <thead class="bg-indigo-600 text-white text-xs uppercase">
            <tr>
              <th class="px-6 py-3">ID</th>
              <th class="px-6 py-3">Nama</th>
              <th class="px-6 py-3">Username</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">No HP</th>
              <th class="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center py-4 text-gray-500">Memuat data...</td>
            </tr>
            <tr v-for="admin in adminList" :key="admin.id_adm" class="border-b hover:bg-gray-50">
              <td class="px-6 py-3 font-medium text-gray-900">{{ admin.id_adm }}</td>
              <td class="px-6 py-3">{{ admin.nm_adm }}</td>
              <td class="px-6 py-3">{{ admin.user_adm }}</td>
              <td class="px-6 py-3">{{ admin.email_adm }}</td>
              <td class="px-6 py-3">{{ admin.no_adm }}</td>
              <td class="px-6 py-3 flex gap-2">
                <button @click="editAdmin(admin)" class="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm">Edit</button>
                <button
                  v-if="admin.id_adm !== 1"
                  @click="deleteAdmin(admin.id_adm)"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="!isLoading && adminList.length === 0">
              <td colspan="6" class="text-center py-4 text-gray-500">Data admin tidak tersedia.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="relative mt-10">
        <div class="fixed bottom-0 left-0 md:left-[20%] w-full md:w-[80%] z-50">
          <router-link to="/UserAdmin/AdminLog/AdminReg" class="block w-full text-center bg-indigo-600 hover:bg-blue-700 text-white font-semibold py-4 shadow-md transition duration-300">
            Tambah Admin Baru
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
