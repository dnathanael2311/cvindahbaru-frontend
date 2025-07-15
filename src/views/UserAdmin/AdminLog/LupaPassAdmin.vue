<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const kirimLinkReset = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const res = await axios.post('https://cvindahbaru.com/api/api/password/email', {
      email: email.value
    })

    successMessage.value = res.data.message || 'Link reset berhasil dikirim.'
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Terjadi kesalahan. Pastikan email valid.'
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <div class="w-screen h-screen overflow-hidden">
    <div class="w-full h-screen flex justify-center items-center bg-[#000C] z-10 absolute top-0 left-0 backdrop-blur-md">
      <div class="w-[90%] sm:w-3/4 md:w-1/2 lg:w-1/4 bg-white py-6 px-5 flex flex-col items-center rounded-lg shadow-lg">
        
        <h1 class="text-3xl md:text-4xl font-semibold">Lupa Password</h1>

        <div class="w-full flex items-start gap-3 text-md p-2">
          <fa icon="fas fa-circle-info" class="w-6 h-6 text-indigo-600 mt-1" />
          <p>Masukkan email aktif anda untuk mengirim link ubah password.</p>
        </div>    

        <div class="flex flex-col gap-3 w-full pt-8 pb-3">
          <input
            v-model="email"
            type="email"
            class="border-2 border-gray-300 px-4 py-2 md:px-5 md:py-3 rounded-lg w-full text-sm md:text-base"
            placeholder="Email Aktif"
            required
          />
        </div>

        <input
          @click="kirimLinkReset"
          :disabled="loading"
          class="bg-indigo-600 text-white rounded-lg px-5 py-3 w-full hover:bg-indigo-700 hover:rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer text-sm md:text-base"
          type="submit"
          :value="loading ? 'Mengirim...' : 'Kirim'"
        />

        <p v-if="successMessage" class="text-green-600 font-medium text-sm mt-3 text-center">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-600 font-medium text-sm mt-3 text-center">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

