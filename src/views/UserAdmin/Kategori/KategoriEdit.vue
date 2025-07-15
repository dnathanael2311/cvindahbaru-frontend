<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const goBack = () => router.back()

const id_ktg = route.query.id
const namaKategori = ref('')
const loading = ref(true)

const fetchKategori = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/kategori`) // Ambil semua
    const data = response.data.find(item => item.id_ktg == id_ktg)

    if (!data) {
      alert('Kategori tidak ditemukan.')
      router.back()
    }

    namaKategori.value = data.nm_ktg
  } catch (err) {
    console.error(err)
    alert('Gagal memuat data kategori.')
  } finally {
    loading.value = false
  }
}

const updateKategori = async () => {
  try {
    await axios.post(`http://localhost:8000/api/kategori/update`, {
      id_ktg,
      nm_ktg: namaKategori.value
    })

    alert('Kategori berhasil diperbarui!')
    router.push('/UserAdmin/Kategori/Kategori') // Balik ke list
  } catch (err) {
    console.error(err)
    alert('Gagal update kategori.')
  }
}

onMounted(() => {
  fetchKategori()
})
</script>

<template>
  <div class="w-full min-h-screen bg-[#000C] backdrop-blur-md flex justify-center items-start pt-10 px-4 pb-10 overflow-auto">
    <div class="w-full max-w-md bg-white rounded-lg p-4 sm:p-6 shadow-md">
      <h1 class="text-lg sm:text-2xl font-bold text-gray-800 mb-6">Update Kategori</h1>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-lg sm:text-xl font-bold text-gray-800">Form Edit</h1>
        <button @click="goBack" class="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium">
          ← Kembali
        </button>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="updateKategori">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Kategori</label>
          <input v-model="namaKategori" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm">
            Update Kategori
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
