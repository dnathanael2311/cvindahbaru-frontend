<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '@/views/Dashboard/Navbar.vue'
import Footer from '@/views/Dashboard/Footer.vue'

const topBarang = ref([])
const router = useRouter()

const fetchTopProduk = async () => {
  try {
    const res = await axios.get('https://cvindahbaru.com/api/api/barang')
    topBarang.value = res.data.slice(0, 5)
  } catch (error) {
    console.error('Gagal mengambil data barang:', error)
  }
}

// Ambil gambar barang
const getImageUrl = (filename) => {
  if (!filename) return '/default.jpg'
  if (filename.startsWith('gambar/')) {
    return `https://cvindahbaru.com/api/storage/${filename}`
  }
  return `https://cvindahbaru.com/api/storage/gambar/${filename}`
}

// Kategori tetap
const kategoriItems = [
  { nama: 'Mug', gambar: new URL('@/assets/Mug.jpg', import.meta.url).href },
  { nama: 'Toples', gambar: new URL('@/assets/Toples.jpg', import.meta.url).href },
  { nama: 'Panci', gambar: new URL('@/assets/Panci.jpg', import.meta.url).href },
  { nama: 'Cangkir', gambar: new URL('@/assets/Cangkir.jpeg', import.meta.url).href }
]

onMounted(async () => {
  fetchTopProduk()

  const idPelanggan = localStorage.getItem('id_plg')
  if (!idPelanggan) return

  const today = new Date()
  const todayKey = today.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
  const rouletteFlagKey = `roulette_done_${todayKey}_${idPelanggan}`

  try {
    const res = await axios.get(`https://cvindahbaru.com/api/api/pelanggan/${idPelanggan}`)
    const pelanggan = res.data

    const birthDate = new Date(pelanggan.tgl_lahir)
    const isBirthday =
      today.getMonth() === birthDate.getMonth() &&
      today.getDate() === birthDate.getDate()

    // ✅ Bukan hari ulang tahun
    if (!isBirthday) return

    // ✅ Sudah spin di localStorage
    if (localStorage.getItem(rouletteFlagKey)) return

    // ✅ Cek ke backend apakah reward sudah diklaim
    const check = await axios.get(`https://cvindahbaru.com/api/api/reward/check-today`, {
      params: { id_plg: idPelanggan }
    })

    if (!check.data.alreadyClaimed) {
      localStorage.setItem(rouletteFlagKey, '1')
      window.location.href = '/Roulette'
    }
  } catch (error) {
    console.error('Gagal cek ulang tahun / reward:', error)
  }
})
</script>

<template>
  <Navbar />
  <div class="pt-16">
    <!-- Hero -->
    <div class="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      <img src="@/assets/slide1.jpg" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/40 flex justify-center items-center z-10 px-4">
        <div class="text-white text-center max-w-3xl md:max-w-4xl">
          <h1 class="text-xl md:text-4xl font-bold mb-4 md:mb-6">
            Lengkapi Dapur dan Rumah Anda dengan Perlengkapan Terbaik
          </h1>
          <p class="text-sm md:text-lg mb-6 md:mb-8">
            Temukan koleksi toples, alat masak, dan perlengkapan rumah lainnya yang fungsional dan bergaya.
          </p>
          <router-link
            to="/Katalog"
            class="inline-block bg-white text-black hover:bg-black hover:text-white rounded-md px-4 md:px-6 py-2 md:py-3 text-sm md:text-lg font-semibold transition"
          >
            Belanja Sekarang
          </router-link>
        </div>
      </div>
    </div>

    <!-- Top Produk -->
    <div class="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
      <h2 class="text-2xl md:text-4xl font-bold text-center mb-8">Top Produk</h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div
          v-for="barang in topBarang"
          :key="barang.id_brg"
          class="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
        >
          <div class="aspect-[3/4] bg-gray-100 overflow-hidden">
            <img :src="getImageUrl(barang.img)" alt="Produk" class="w-full h-full object-cover" />
          </div>
          <div class="p-3 text-center">
            <h3 class="text-sm md:text-base font-semibold text-gray-800 mb-2 truncate">
              {{ barang.nm_brg }}
            </h3>
            <router-link
              :to="`/DetailKatalog/${barang.id_brg}`"
              class="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 rounded-md transition"
            >
              Lihat Detail
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>
