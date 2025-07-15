<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const nama = ref('')
const email = ref('')
const telp = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

const register = async () => {
  error.value = ''
  success.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Password tidak sama'
    return
  }

  if (password.value.length !== 8) {
    error.value = 'Password harus 8 karakter'
    return
  }

  try {
    const res = await axios.post('https://cvindahbaru.com/api/api/admin/add', {
      nm_adm: nama.value,
      user_adm: username.value,
      email_adm: email.value,
      no_adm: telp.value,
      pass_adm: password.value
    })

    success.value = 'Registrasi berhasil!'
    setTimeout(() => {
      router.push('/UserAdmin/Laporan/ListAdmin')
    }, 1500)
  } catch (err) {
    if (err.response?.data) {
      error.value = err.response.data
    } else {
      error.value = 'Terjadi kesalahan saat menghubungi server.'
    }
  }
}
</script>

<template>
  <div class="w-screen min-h-screen overflow-auto">
    <div class="w-full min-h-screen flex justify-center items-center bg-[#000C] z-10 absolute top-0 left-0 backdrop-blur-md px-4">
      <div class="w-full sm:w-3/4 md:w-2/3 lg:w-1/3 bg-white py-6 px-5 flex flex-col items-center rounded-lg shadow-lg">
        <h1 class="text-3xl md:text-4xl font-semibold text-center">Register Admin</h1>

        <div class="flex flex-col gap-3 w-full pt-8 pb-4">
          <input v-model="username" class="border-2 border-gray-300 px-4 py-2 rounded-lg w-full text-sm md:text-base" type="text" placeholder="Username" />
          <input v-model="nama" class="border-2 border-gray-300 px-4 py-2 rounded-lg w-full text-sm md:text-base" type="text" placeholder="Nama Lengkap" />
          <input v-model="email" class="border-2 border-gray-300 px-4 py-2 rounded-lg w-full text-sm md:text-base" type="text" placeholder="Email" />
          <input v-model="telp" class="border-2 border-gray-300 px-4 py-2 rounded-lg w-full text-sm md:text-base" type="text" placeholder="No. Telp" />
          <input v-model="password" class="border-2 border-gray-300 px-4 py-2 rounded-lg w-full text-sm md:text-base" type="password" placeholder="Password (8 karakter)" />
          <input v-model="confirmPassword" class="border-2 border-gray-300 px-4 py-2 rounded-lg w-full text-sm md:text-base" type="password" placeholder="Confirm Password" />
        </div>

        <p v-if="error" class="text-red-600 text-sm mb-2 text-center">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm mb-2 text-center">{{ success }}</p>

        <button @click="register" class="bg-indigo-600 text-white rounded-lg px-5 py-3 w-full hover:bg-indigo-700 hover:shadow-lg hover:scale-105 transition duration-300 text-sm md:text-base">
          Register
        </button>
      </div>
    </div>
  </div>
</template>
