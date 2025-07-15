<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    const response = await axios.post('http://localhost:8000/api/pelanggan/login', {
      user_plg: username.value,
      pass_plg: password.value,
    })

    // Debug response dari backend
    console.log('Response dari server:', response.data)

    // Validasi isi response
    if (response.data.id_plg && response.data.nama) {
      localStorage.setItem('id_plg', response.data.id_plg)
      localStorage.setItem('namaPelanggan', response.data.nama)
      console.log('ID Pelanggan:', response.data.id_plg)

      router.push('/') // arahkan ke halaman utama
    } else {
      errorMsg.value = 'Login gagal: Data tidak lengkap dari server'
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMsg.value = 'Username atau password salah'
    } else {
      errorMsg.value = 'Terjadi kesalahan saat login'
    }
  }
}
</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <div class="w-full h-screen flex justify-center items-center bg-[#000C] backdrop-blur-md px-4">
      <div class="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white py-6 px-4 sm:px-6 md:px-8 flex flex-col items-center rounded-lg">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold">Login Pelanggan</h1>

        <!-- Input -->
        <div class="flex flex-col gap-3 w-full pt-8 pb-3">
          <input v-model="username" type="text" placeholder="Username"
            class="border-2 border-gray-300 px-4 py-2 sm:px-5 sm:py-3 rounded-lg w-full text-sm sm:text-base" />
          <input v-model="password" type="password" placeholder="Password"
            class="border-2 border-gray-300 px-4 py-2 sm:px-5 sm:py-3 rounded-lg w-full text-sm sm:text-base" />
        </div>

        <p class="self-start pb-4 text-xs sm:text-sm cursor-pointer text-indigo-600 hover:underline">
          <router-link to="/User/UserLog/LupaPassUser" class="hover:text-indigo-600">Lupa Password?</router-link>
        </p>

        <!-- Tombol login -->
        <button @click="login"
          class="bg-indigo-600 text-white rounded-lg px-5 py-3 w-full hover:bg-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer text-sm sm:text-base">
          Login
        </button>

        <!-- Link daftar -->
        <p class="text-center pt-4 text-xs sm:text-sm">
          Belum Punya Akun?
          <router-link to="/User/UserLog/UserReg" class="hover:text-indigo-600">Daftar</router-link> Disini
        </p>

        <!-- Pesan error -->
        <p v-if="errorMsg" class="text-red-600 mt-3 text-sm">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>
