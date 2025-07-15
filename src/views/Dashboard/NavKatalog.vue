<!-- Tambahan di atas <script setup> -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const showSidebar = ref(false)
const isDesktop = ref(window.innerWidth >= 768)
const isOpen = ref(false)
const dropdownRef = ref(null)
const kategoriList = ref([])

const updateScreen = () => {
  isDesktop.value = window.innerWidth >= 768
  showSidebar.value = isDesktop.value
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

const fetchKategori = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/kategori')
    kategoriList.value = res.data
  } catch (err) {
    console.error('Gagal ambil kategori:', err)
  }
}

const emit = defineEmits(['filter-kategori'])

const pilihKategori = (id_ktg) => {
  emit('filter-kategori', id_ktg)
  isOpen.value = false
  if (!isDesktop.value) showSidebar.value = false
}

onMounted(() => {
  updateScreen()
  fetchKategori()
  window.addEventListener('resize', updateScreen)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreen)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <!-- Tombol Hamburger Mobile -->
  <div v-if="!isDesktop" class="fixed top-4 left-4 z-50 md:hidden">
    <button @click="showSidebar = true" class="text-gray-700 bg-white p-2 rounded shadow-md">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  <!-- Overlay -->
  <transition name="fade">
    <div v-if="showSidebar && !isDesktop" class="fixed inset-0 bg-black/30 z-40" @click="showSidebar = false"></div>
  </transition>

  <!-- Sidebar -->
  <transition name="slide">
    <aside
      class="fixed top-0 left-0 z-50 bg-white shadow-md w-4/5 max-w-xs h-full transition-transform duration-300 md:translate-x-0 md:w-[260px] md:h-screen md:z-30"
      :class="{ '-translate-x-full': !showSidebar && !isDesktop, 'translate-x-0': showSidebar || isDesktop }"
    >
      <!-- Header Mobile -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
        <h1 class="text-lg font-bold text-indigo-600">Katalog</h1>
        <button @click="showSidebar = false" class="text-2xl text-gray-600">&times;</button>
      </div>

      <!-- MENU: Home -->
      <div class="p-4 border-b border-gray-200">
        <router-link
          to="/"
          class="flex items-center gap-2 text-gray-800 font-semibold px-4 py-2 hover:bg-gray-100 rounded transition"
          @click="showSidebar = false"
        >
        <fa icon="fas fa-home" class="w-5 h-5 mr-3" />
          <span>Home</span>
        </router-link>
      </div>

      <!-- Dropdown Kategori -->
      <div ref="dropdownRef" class="p-4">
        <button
          @click="toggleDropdown"
          class="w-full text-left flex items-center justify-between text-indigo-700 font-semibold px-4 py-2 hover:bg-gray-100 rounded"
        >
          <span>Kategori</span>
          <svg
            :class="{ 'rotate-180': isOpen }"
            class="w-4 h-4 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div v-if="isOpen" class="mt-2 bg-white shadow rounded-md max-h-64 overflow-y-auto">
          <a
            v-for="ktg in kategoriList"
            :key="ktg.id_ktg"
            href="#"
            @click.prevent="pilihKategori(ktg.id_ktg)"
            class="block px-4 py-2 hover:bg-gray-100 text-sm"
          >
            {{ ktg.nm_ktg }}
          </a>
        </div>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
