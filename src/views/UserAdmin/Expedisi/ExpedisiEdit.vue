<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const goBack = () => router.back()

const id_exp = route.query.id_exp
const nm_exp = ref('')
const no_exp = ref('')
const email_exp = ref('')
const loading = ref(true)
const isSubmitting = ref(false)

const fetchExpedisi = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/expedisi') // Ambil semua expedisi
    const data = response.data.find(item => item.id_exp == id_exp)

    if (!data) {
      alert('Expedisi tidak ditemukan.')
      router.back()
    }

    nm_exp.value = data.nm_exp
    no_exp.value = data.no_exp
    email_exp.value = data.email_exp
  } catch (err) {
    console.error(err)
    alert('Gagal memuat data expedisi.')
  } finally {
    loading.value = false
  }
}

const updateExpedisi = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      id_exp,
      nm_exp: nm_exp.value,
      no_exp: no_exp.value,
      email_exp: email_exp.value
    }
    await axios.post('http://localhost:8000/api/expedisi/update', payload)
    router.push('/UserAdmin/Expedisi/Expedisi')
  } catch (err) {
    alert('Gagal update data')
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchExpedisi()
})
</script>

<template>
  <div class="w-full min-h-screen bg-[#000C] backdrop-blur-md flex justify-center items-start pt-10 px-4 pb-10 overflow-auto">
    <div class="w-full max-w-md bg-white rounded-lg p-4 sm:p-6 shadow-md">
      <h1 class="text-lg sm:text-2xl font-bold text-gray-800 mb-6">Update Expedisi</h1>

      <div class="flex justify-between items-center mb-4">
        <h1 class="text-lg sm:text-xl font-bold text-gray-800">Edit Data Expedisi</h1>
        <button @click="goBack" class="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium">
          ← Kembali
        </button>
      </div>

      <form @submit.prevent="updateExpedisi" class="flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700">Nama Expedisi</label>
            <input v-model="nm_exp" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700">No. Telp</label>
            <input v-model="no_exp" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email_exp" type="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>

        <div class="pt-4">
          <button type="submit" :disabled="isSubmitting" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm">
            {{ isSubmitting ? 'Menyimpan...' : 'Update Expedisi' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
