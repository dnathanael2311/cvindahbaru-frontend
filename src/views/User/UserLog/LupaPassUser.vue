<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const successMsg = ref('')
const errorMsg = ref('')

const kirimLink = async () => {
  try {
    await axios.post('http://localhost:8000/api/admin/password/forgot', { email: email.value })

    successMsg.value = 'Link reset password telah dikirim ke email Anda.'
    errorMsg.value = ''
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Gagal mengirim email.'
    successMsg.value = ''
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
          <p>Masukkan email aktif Anda untuk mengirim link ubah password.</p>
        </div>    

        <div class="flex flex-col gap-3 w-full pt-8 pb-3">
          <input
            v-model="email"
            class="border-2 border-gray-300 px-4 py-2 md:px-5 md:py-3 rounded-lg w-full text-sm md:text-base"
            placeholder="Email Aktif"
            type="email"
          />
        </div>

        <button
          @click="kirimLink"
          class="bg-indigo-600 text-white rounded-lg px-5 py-3 w-full hover:bg-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer text-sm md:text-base"
        >
          Kirim
        </button>

        <p v-if="successMsg" class="text-green-600 text-sm mt-3">{{ successMsg }}</p>
        <p v-if="errorMsg" class="text-red-600 text-sm mt-3">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>
