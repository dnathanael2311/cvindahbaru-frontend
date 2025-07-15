<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)
const router = useRouter()
const emit = defineEmits(['navigate'])

const namaAdmin = ref('Admin')

// Ambil namaAdmin dari localStorage saat mounted
onMounted(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('admin')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        namaAdmin.value = parsed.nm_adm || 'Admin'
      } catch (e) {
        console.error('Gagal parse admin:', e)
      }
    }
  }
})

const go = (section) => {
  if (router.currentRoute.value.path !== '/UserAdmin/AdminDash') {
    router.push({ path: '/UserAdmin/AdminDash', query: { section } })
  } else {
    emit('navigate', section)
  }
  isOpen.value = false
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const logout = () => {
  localStorage.removeItem('admin')
  router.push('/UserAdmin/AdminLog/AdminLog')
}
</script>

<template>
  <aside class="fixed top-0 left-0 h-screen w-[260px] bg-white shadow-md flex flex-col z-50 md:z-auto overflow-y-auto">
    <div class="p-4 flex items-center text-indigo-600 text-lg md:text-xl font-bold mb-4">
      <fa icon="fas fa-user" class="w-5 h-5 mr-3" />
      Hello, {{ namaAdmin }}
    </div>

    <button @click="go('profil')" class="flex items-center text-indigo-600 text-sm md:text-base font-medium py-2 px-4 hover:bg-indigo-600 hover:text-white rounded transition">
      <fa icon="fas fa-gear" class="w-5 h-5 mr-3" />
      Profil Admin
    </button>

    <button @click="go('security')" class="flex items-center text-indigo-600 text-sm md:text-base font-medium py-2 px-4 hover:bg-indigo-600 hover:text-white rounded transition">
      <fa icon="fas fa-key" class="w-5 h-5 mr-3" />
      Login & Security
    </button>

    <router-link to="/UserAdmin/Laporan/ListAdmin" class="flex items-center text-indigo-600 text-sm md:text-base font-medium py-2 px-4 hover:bg-indigo-600 hover:text-white rounded transition">
      <fa icon="fas fa-users" class="w-5 h-5 mr-3" />
      List Admin
    </router-link>

    <!-- Dropdown Laporan -->
    <div class="relative">
      <button @click="toggleDropdown" class="w-full flex items-center justify-between text-indigo-600 text-sm md:text-base font-medium py-2 px-4 hover:bg-indigo-600 hover:text-white rounded transition">
        <div class="flex items-center">
          <fa icon="fas fa-chart-simple" class="w-5 h-5 mr-3" />
          <span>Laporan</span>
        </div>
        <svg :class="{ 'rotate-180': isOpen }" class="w-4 h-4 ml-2 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <div v-if="isOpen" class="absolute left-0 w-full bg-white shadow-lg mt-2 rounded-md z-50">
        <router-link to="/UserAdmin/Laporan/Penjualan" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Laporan Penjualan</router-link>
        <router-link to="/UserAdmin/Barang/Barang" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">List Barang</router-link>
        <router-link to="/UserAdmin/Kategori/Kategori" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">List Kategori</router-link>
        <router-link to="/UserAdmin/Expedisi/Expedisi" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">List Expedisi</router-link>
        <router-link to="/UserAdmin/Laporan/BarangMsk" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Laporan Barang Masuk</router-link>
        <router-link to="/UserAdmin/Laporan/BarangKlr" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Laporan Barang Keluar</router-link>
        <router-link to="/UserAdmin/AdminRetur/ReturMsk" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Retur Masuk</router-link>
      </div>
    </div>

    <!-- Logout -->
    <div class="mt-auto px-4 py-4">
      <button @click="logout" class="flex items-center text-red-600 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition w-full">
        <fa icon="fas fa-right-from-bracket" class="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
  </aside>
</template>
