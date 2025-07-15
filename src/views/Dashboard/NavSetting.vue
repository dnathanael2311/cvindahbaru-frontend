<script setup>
import { defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const emit = defineEmits(['navigate', 'back'])
const router = useRouter()

const showSidebar = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)
const nm_plg = ref('Pelanggan') // default nama

function updateScreen() {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value) showSidebar.value = true
}

const id_plg = localStorage.getItem('id_plg')
const namaPelanggan = ref('')

const fetchPelanggan = async () => {
  try {
    const res = await axios.get(`https://cvindahbaru.com/api/api/pelanggan/${id_plg}`)
    namaPelanggan.value = res.data.nm_plg
  } catch (error) {
    console.warn('Gagal ambil data pelanggan dari backend. Pakai data localStorage saja.')
    namaPelanggan.value = localStorage.getItem('namaPelanggan') || 'Pelanggan'
  }
}

function go(section) {
  if (router.currentRoute.value.path === '/User/Profile/UserSet') {
    emit('navigate', section)
  } else {
    router.push({ path: '/User/Profile/UserSet', query: { section } })
  }
}

onMounted(() => {
  updateScreen()
  fetchPelanggan()
  window.addEventListener('resize', updateScreen)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreen)
})
</script>


<template>
  <div class="lg:hidden fixed top-4 left-4 z-50">
    <button @click="showSidebar = true" class="text-gray-700 bg-white p-2 rounded shadow-md">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  <transition name="fade">
    <div v-if="showSidebar && !isDesktop" class="fixed inset-0 bg-black/40 z-40" @click="showSidebar = false"></div>
  </transition>

  <transition name="slide"> 
    <div v-if="showSidebar || isDesktop" class="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg flex flex-col p-4 z-50 transition-transform duration-300 transform" :class="{ '-translate-x-full': !showSidebar && !isDesktop, 'translate-x-0': showSidebar || isDesktop }" >

      <div class="lg:hidden flex justify-end mb-4">
        <button @click="showSidebar = false" class="text-gray-700 text-2xl">&times;</button>
      </div>

      <button @click="go('profildet')" class="flex items-center text-indigo-600 text-xl font-bold mb-6">
        <fa icon="fas fa-user" class="w-6 h-6 mr-3" />
        <span>Hello, {{ namaPelanggan }}</span>
      </button>

      <button @click="go('profil')" class="flex items-center text-[#4f46e5] text-base font-semibold px-2 py-3 hover:bg-[#4f46e5] hover:text-white rounded transition mb-1">
        <fa icon="fas fa-gear" class="w-5 h-5 mr-3" />
        Profil User
      </button>

      <button @click="go('alamat')" class="flex items-center text-[#4f46e5] text-base font-semibold px-2 py-3 hover:bg-[#4f46e5] hover:text-white rounded transition mb-1">
        <fa icon="fas fa-home" class="w-5 h-5 mr-3" />
        Alamat
      </button>

      <button @click="go('security')" class="flex items-center text-[#4f46e5] text-base font-semibold px-2 py-3 hover:bg-[#4f46e5] hover:text-white rounded transition mb-1">
        <fa icon="fas fa-key" class="w-5 h-5 mr-3" />
        Login & Security
      </button>

      <router-link to="/User/Keranjang" class="flex items-center text-[#4f46e5] text-base font-semibold px-2 py-3 hover:bg-[#4f46e5] hover:text-white rounded transition mb-1">
        <fa icon="fas fa-cart-shopping" class="w-5 h-5 mr-3" />
        Keranjang
      </router-link>

      <router-link to="/User/Profile/Order" class="flex items-center text-[#4f46e5] text-base font-semibold px-2 py-3 hover:bg-[#4f46e5] hover:text-white rounded transition mb-1">
        <fa icon="fas fa-clock-rotate-left" class="w-5 h-5 mr-3" />
        Histori Belanja
      </router-link>

      <router-link to="/User/Retur/HsRetur" class="flex items-center text-[#4f46e5] text-base font-semibold px-2 py-3 hover:bg-[#4f46e5] hover:text-white rounded transition mb-1">
        <fa icon="fas fa-rotate-left" class="w-5 h-5 mr-3" />
        Histori Retur
      </router-link>

      <router-link to="/User/UserLog/UserLog" class="mt-auto flex items-center text-red-700 text-base font-semibold px-2 py-3 hover:bg-red-700 hover:text-white rounded transition">
      <fa icon="fas fa-right-from-bracket" class="w-5 h-5 mr-3" />
      Logout
      </router-link>
    </div>
  </transition>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .slide-enter-active, .slide-leave-active {
    transition: transform 0.3s ease;
  }
  .slide-enter-from, .slide-leave-to {
    transform: translateX(-100%);
  }
</style>
