<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive input & error
const username = ref('')
const password = ref('')
const errorMsg = ref('')

const login = async () => {
  errorMsg.value = ''

  if (!username.value || !password.value) {
    errorMsg.value = 'Username dan password harus diisi'
    return
  }

  try {
    const response = await axios.post('https://cvindahbaru.com/api/api/admin/login', {
      user_adm: username.value,
      pass_adm: password.value,
    })
    localStorage.setItem('admin', JSON.stringify(response.data))
    // Simpan token dan nama admin ke localStorage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('namaAdmin', response.data.nama)

    // Arahkan ke dashboard
    router.push('/UserAdmin/AdminDash')
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMsg.value = 'Username atau password salah'
    } else {
      errorMsg.value = 'Terjadi kesalahan, coba lagi nanti'
    }
  }
}
</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <div class="w-full h-screen flex justify-center items-center bg-[#000C] z-10 absolute top-0 left-0 backdrop-blur-md px-4">
      <div class="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white py-6 px-4 sm:px-6 md:px-8 flex flex-col items-center rounded-lg">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold">Login Admin</h1>

        <!-- Input -->
        <div class="flex flex-col gap-3 w-full pt-8 pb-3">
          <input v-model="username" type="text" placeholder="Username" class="border-2 border-gray-300 px-4 py-2 sm:px-5 sm:py-3 rounded-lg w-full text-sm sm:text-base" />
          <input v-model="password" type="password" placeholder="Password" class="border-2 border-gray-300 px-4 py-2 sm:px-5 sm:py-3 rounded-lg w-full text-sm sm:text-base" />
        </div>

        <p class="self-start pb-4 text-xs sm:text-sm cursor-pointer text-indigo-600 hover:underline">
          <router-link to="/User/UserLog/LupaPassUser" class="hover:text-indigo-600">Lupa Password?</router-link>
        </p>

        <!-- Tombol login -->
        <button @click="login" class="bg-indigo-600 text-white rounded-lg px-5 py-3 w-full hover:bg-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer text-sm sm:text-base">
          Login
        </button>
        <!-- Pesan error -->
        <p v-if="errorMsg" class="text-red-600 mt-3 text-sm">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>
