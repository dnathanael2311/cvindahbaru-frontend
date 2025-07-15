<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const router = useRouter()
const goBack = () => router.back()

const namaKategori = ref('')

const tambahKategori = async () => {
  if (!namaKategori.value) {
    alert('Nama kategori harus diisi.')
    return
  }

  try {
    await axios.post('http://localhost:8000/api/kategori/add', {
      nm_ktg: namaKategori.value
    })
    alert('Kategori berhasil ditambahkan.')
    router.back()
  } catch (error) {
    alert('Gagal menambahkan kategori.')
    console.error(error)
  }
}
</script>

<template>
  <div class="w-full min-h-screen bg-[#000C] backdrop-blur-md flex justify-center items-start pt-10 px-4 pb-10 overflow-auto">
    <div class="w-full max-w-md bg-white rounded-lg p-4 sm:p-6 shadow-md">
      <h1 class="text-lg sm:text-2xl font-bold text-gray-800 mb-6">Tambah Kategori</h1>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-lg sm:text-xl font-bold text-gray-800">Tambah Barang Keluar</h1>
        <button @click="goBack" class="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium">
          ← Kembali
        </button>
      </div>

      <form @submit.prevent="tambahKategori" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Kategori</label>
          <input v-model="namaKategori" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm">
            Tambah Kategori
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
