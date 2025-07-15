<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const router = useRouter()
const goBack = () => router.back()

const nama = ref('')
const telepon = ref('')
const email = ref('')

const tambahExpedisi = async () => {
  if (!nama.value || !telepon.value || !email.value) {
    alert('Semua field harus diisi')
    return
  }

  try {
    const res = await axios.post('https://cvindahbaru.com/api/api/expedisi/add', {
      nm_exp: nama.value,
      no_exp: telepon.value,
      email_exp: email.value
    })

    alert('Expedisi berhasil ditambahkan')
    router.back()
  } catch (err) {
    if (err.response?.status === 409) {
      alert('Expedisi sudah terdaftar')
    } else {
      alert('Gagal menambah expedisi')
      console.error(err)
    }
  }
}
</script>

<template>
  <div class="w-full min-h-screen bg-[#000C] backdrop-blur-md flex justify-center items-start pt-10 px-4 pb-10 overflow-auto">
    <div class="w-full max-w-md bg-white rounded-lg p-4 sm:p-6 shadow-md">
      <h1 class="text-lg sm:text-2xl font-bold text-gray-800 mb-6">Tambah Expedisi</h1>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-lg sm:text-xl font-bold text-gray-800">Tambah Barang Keluar</h1>
        <button @click="goBack" class="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium">← Kembali</button>
      </div>

      <form @submit.prevent="tambahExpedisi" class="flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700">Nama Expedisi</label>
            <input v-model="nama" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700">No. Telp</label>
            <input v-model="telepon" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm">
            Tambah Expedisi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
