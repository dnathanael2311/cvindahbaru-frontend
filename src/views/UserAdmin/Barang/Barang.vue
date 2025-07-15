<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import NavAdmin from '@/views/Dashboard/NavAdmin.vue'

const router = useRouter()

const sidebarOpen = ref(false)
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value
const closeSidebar = () => sidebarOpen.value = false

const barangList = ref([])
const isLoading = ref(true)

async function fetchBarang() {
  isLoading.value = true
  try {
    const response = await axios.get('http://localhost:8000/api/barang')
    barangList.value = response.data
  } catch (error) {
    console.error('Gagal ambil data barang:', error)
  } finally {
    isLoading.value = false
  }
}

async function deleteBarang(id_brg) {
  if (confirm('Yakin ingin menghapus barang ini?')) {
    try {
      await axios.post('http://localhost:8000/api/barang/delete', { id_brg })
      alert('Barang berhasil dihapus.')
      await fetchBarang()
    } catch (error) {
      console.error('Gagal hapus barang:', error)
      alert('Gagal menghapus barang.')
    }
  }
}

const editBarang = (barang) => {
  router.push({ path: '/UserAdmin/Barang/BarangEdit', query: { id_brg: barang.id_brg } })
}

onMounted(fetchBarang)

const getImageUrl = (filename) => {
  if (!filename) return '/default.jpg'
  if (filename.startsWith('gambar/')) {
    return `http://localhost:8000/storage/${filename}`
  }
  return `http://localhost:8000/storage/gambar/${filename}`
}
</script>


<template>
  <div class="w-full min-h-screen flex flex-col md:flex-row bg-gray-50">
    <div class="md:hidden flex justify-between items-center bg-indigo-600 text-white px-4 py-3 shadow-md">
      <h1 class="text-lg font-semibold">Data Barang</h1>
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
          <fa icon="fas fa-arrow-left" class="w-5 h-5 mr-2" /> Tutup Menu
        </button>
      </div>
      <NavAdmin />
    </div>

    <div class="w-full md:w-4/5 py-6 px-4 md:px-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
        Daftar Barang
      </h1>

      <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-6 max-w-md">
        <input type="text" placeholder="Cari produk..." class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          Cari
        </button>
      </div>

      <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
        <table class="min-w-full text-sm md:text-base text-left text-gray-700">
          <thead class="bg-indigo-600 text-white text-xs md:text-sm uppercase">
            <tr>
              <th class="px-4 md:px-6 py-3">ID</th>
              <th class="px-4 md:px-6 py-3">Kategori</th>
              <th class="px-4 md:px-6 py-3">Nama</th>
              <th class="px-4 md:px-6 py-3">Gambar</th>
              <th class="px-4 md:px-6 py-3">Merek</th>
              <th class="px-4 md:px-6 py-3">Stok</th>
              <th class="px-4 md:px-6 py-3">Satuan</th>
              <th class="px-4 md:px-6 py-3">Berat</th>
              <th class="px-4 md:px-6 py-3">Diskon</th>
              <th class="px-4 md:px-6 py-3">Harga</th>
              <th class="px-4 md:px-6 py-3">Deskripsi</th>
              <th class="px-4 md:px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="11" class="text-center py-4 text-gray-500">Memuat data...</td>
            </tr>
            <tr v-for="barang in barangList" :key="barang.id_brg" class="border-b hover:bg-gray-50">
              <td class="px-4 md:px-6 py-3 font-medium text-gray-900">{{ barang.id_brg }}</td>
              <td class="px-4 md:px-6 py-3">{{ barang.kategori?.nm_ktg || barang.id_ktg }}</td>
              <td class="px-4 md:px-6 py-3">{{ barang.nm_brg }}</td>
              <td class="px-4 md:px-6 py-3">
                <img v-if="barang.img" :src="getImageUrl(barang.img)" alt="gambar" class="w-12 h-12 object-cover rounded" />
                <span v-else>-</span>
              </td>
              <td class="px-4 md:px-6 py-3">{{ barang.merk }}</td>
              <td class="px-4 md:px-6 py-3">{{ barang.stok }}</td>
              <td class="px-4 md:px-6 py-3">{{ barang.satuan_brg }}</td>
              <td class="px-4 md:px-6 py-3">{{ barang.berat }}</td>
              <td class="px-4 md:px-6 py-3">{{ barang.diskon }}</td>
              <td class="px-4 md:px-6 py-3">{{ barang.harga_brg }}</td>
              <td class="px-4 md:px-6 py-3">{{ barang.desk_brg }}</td>
              <td class="px-4 md:px-6 py-3 flex flex-col md:flex-row gap-1">
                <button @click="editBarang(barang)" class="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 text-center">
                  Edit
                </button>
                <button @click="deleteBarang(barang.id_brg)" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 text-center">
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="!isLoading && barangList.length === 0">
              <td colspan="11" class="text-center py-4 text-gray-500">Data barang tidak tersedia.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="relative mt-10">
        <div class="fixed bottom-0 left-0 md:left-[20%] w-full md:w-[80%] z-50">
          <router-link to="/UserAdmin/Barang/BarangTbh" class="block w-full text-center bg-indigo-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-none shadow-md transition duration-300">
            Tambah Barang Baru
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
