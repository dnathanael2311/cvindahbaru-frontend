<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import NavKatalog from '@/views/Dashboard/NavKatalog.vue'
import Footer from '@/views/Dashboard/Footer.vue'

const barangList = ref([])
const barangTampil = ref([]) // data yang ditampilkan
const isLoading = ref(true)
const error = ref('')
const searchTerm = ref('')
const kategoriDipilih = ref(null)

// Ambil semua barang
const getBarang = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/barang')
    barangList.value = res.data
    barangTampil.value = res.data
  } catch (e) {
    error.value = 'Gagal memuat katalog barang.'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

// Handle filter berdasarkan kategori dari NavKatalog
const filterByKategori = (id_ktg) => {
  kategoriDipilih.value = id_ktg
  barangTampil.value = barangList.value.filter(b => b.id_ktg === id_ktg)
}

// Fungsi gambar
const getImageUrl = (filename) => {
  if (!filename) return '/default.jpg'
  if (filename.startsWith('gambar/')) {
    return `http://localhost:8000/storage/${filename}`
  }
  return `http://localhost:8000/storage/gambar/${filename}`
}

onMounted(() => {
  getBarang()
})
</script>

<template>
  <!-- Sidebar -->
  <NavKatalog @filter-kategori="filterByKategori" />

  <!-- Konten Katalog -->
  <main class="pt-20 md:pl-[260px] p-6 bg-gray-50 min-h-screen">
    <!-- Pencarian -->
    <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-6 max-w-md mx-auto">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Cari produk..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        Cari
      </button>
    </div>

    <!-- Loader / Error -->
    <div v-if="isLoading" class="text-center text-gray-500 py-10">Memuat katalog...</div>
    <div v-else-if="error" class="text-center text-red-500 py-10">{{ error }}</div>

    <!-- Katalog -->
    <div v-else>
      <div v-if="barangTampil.length === 0" class="text-center text-gray-500 py-10">
        Tidak ada barang ditemukan untuk kategori ini.
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="barang in barangTampil.filter(b => (b.nm_brg || '').toLowerCase().includes(searchTerm.toLowerCase()))"
          :key="barang.id_brg"
          class="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition"
        >
          <img
            :src="getImageUrl(barang.img)"
            alt="Foto barang"
            class="w-full h-48 object-cover"
          />
          <div class="p-4 flex flex-col gap-2">
            <h3 class="font-semibold text-lg text-gray-800 truncate">{{ barang.nm_brg }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2">{{ barang.desk_brg }}</p>
            <p class="text-sm text-gray-700">
              <strong>Stok:</strong> {{ barang.stok }} {{ barang.satuan_brg }}
            </p>
            <p class="text-sm text-indigo-600 font-bold">
              Rp {{ new Intl.NumberFormat('id-ID').format(barang.harga_brg) }}
            </p>
            <router-link
              :to="`/DetailKatalog/${barang.id_brg}`"
              class="mt-3 inline-block text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            >
              Lihat Detail
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
