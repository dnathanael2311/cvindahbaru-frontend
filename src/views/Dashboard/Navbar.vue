<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const showSidebar = ref(false)
const showDropdown = ref(false)
const dropdownRef = ref(null)
const showNavbar = ref(true)
const isLoggedIn = ref(false)
const router = useRouter()

// Cek status login pelanggan
onMounted(() => {
  const idPelanggan = localStorage.getItem('id_plg')
  isLoggedIn.value = !!idPelanggan

  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

// Fungsi Logout
const logout = () => {
  localStorage.removeItem('id_plg')
  localStorage.removeItem('token')
  isLoggedIn.value = false
  router.push('/User/UserLog/UserLog')
}

// Fungsi saat klik tombol keranjang
const goKeranjang = () => {
  if (isLoggedIn.value) {
    router.push('/User/Keranjang')
  } else {
    router.push('/User/UserLog/UserLog')
  }
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showDropdown.value = false
  }
}
let lastScrollTop = 0
const handleScroll = () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop
  showNavbar.value = currentScroll <= lastScrollTop
  lastScrollTop = Math.max(0, currentScroll)
}
</script>

<template>
  <nav :class="['fixed top-0 left-0 w-full z-50 bg-white shadow-xl transition-transform duration-300', showNavbar ? 'translate-y-0' : '-translate-y-full']">
    <div class="w-screen px-4">
      <div class="flex justify-between h-16 items-center">
        <div class="text-xl font-bold text-indigo-600">Indah Baru</div>

        <button class="md:hidden text-gray-700" @click="showSidebar = true">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="hidden md:flex space-x-4 items-center">
          <router-link to="/" class="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">Home</router-link>
          <router-link to="/About" class="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">Tentang Kami</router-link>
          <router-link to="/Katalog" class="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">Katalog</router-link>

          <!-- Tombol Keranjang -->
          <button @click="goKeranjang" class="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">Keranjang</button>

          <!-- Dropmenu User -->
          <div class="relative" ref="dropdownRef">
            <button @click="toggleDropdown" class="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition">User</button>
            <div v-if="showDropdown" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
              <template v-if="isLoggedIn">
                <router-link to="/User/Profile/UserSet" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pengaturan</router-link>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100">Logout</button>
              </template>
              <template v-else>
                <router-link to="/User/UserLog/UserLog" class="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50">Login</router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Sidebar Mobile -->
  <transition name="slide">
    <div v-if="showSidebar" class="fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50 p-6 md:hidden">
      <button class="mb-4 text-gray-600 text-2xl" @click="showSidebar = false">&times;</button>
      <ul class="flex flex-col gap-4 text-gray-800">
        <li><router-link to="/" class="hover:text-indigo-600" @click="showSidebar = false">Home</router-link></li>
        <li><router-link to="/About" class="hover:text-indigo-600" @click="showSidebar = false">Tentang Kami</router-link></li>
        <li><router-link to="/Katalog" class="hover:text-indigo-600" @click="showSidebar = false">Katalog</router-link></li>
        <li>
          <button @click="() => { goKeranjang(); showSidebar.value = false }" class="hover:text-indigo-600 text-left w-full">Keranjang</button>
        </li>

        <template v-if="isLoggedIn">
          <li><router-link to="/User/Profile/UserSet" class="hover:text-indigo-600" @click="showSidebar = false">Pengaturan</router-link></li>
          <li>
            <button @click="() => { logout(); showSidebar.value = false }" class="text-red-600 hover:text-red-700 text-left w-full">Logout</button>
          </li>
        </template>
        <template v-else>
          <li><router-link to="/User/UserLog/UserLog" class="text-indigo-600 hover:text-indigo-800" @click="showSidebar = false">Login</router-link></li>
        </template>
      </ul>
    </div>
  </transition>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
