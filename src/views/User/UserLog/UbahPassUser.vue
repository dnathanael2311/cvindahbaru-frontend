<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const successMsg = ref('')
const errorMsg = ref('')

onMounted(() => {
  token.value = route.query.token || ''
  if (!token.value) {
    errorMsg.value = 'Token tidak valid atau hilang.'
  }
})

const ubahPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'Konfirmasi password tidak cocok.'
    return
  }

  try {
    await axios.post('http://localhost:8000/api/reset-password', {
      token: token.value,
      password: newPassword.value
    })
    successMsg.value = 'Password berhasil diubah.'
    errorMsg.value = ''
    setTimeout(() => router.push('/UserAdmin/AdminLog/AdminLog'), 2000)
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Gagal mengubah password.'
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
            <p>Ubah password anda disini.</p>
        </div>    
        <div class="flex flex-col gap-3 w-full pt-8 pb-3">
          <input class="border-2 border-gray-300 px-4 py-2 md:px-5 md:py-3 rounded-lg w-full text-sm md:text-base" placeholder="Password Baru" />
          <input class="border-2 border-gray-300 px-4 py-2 md:px-5 md:py-3 rounded-lg w-full text-sm md:text-base" placeholder="Konfirmasi Password" />        
        </div>

        <input class="bg-indigo-600 text-white rounded-lg px-5 py-3 w-full hover:bg-indigo-700 hover:rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer text-sm md:text-base" type="submit" value="Ubah Password" />
      </div>
    </div>
  </div>
</template>
