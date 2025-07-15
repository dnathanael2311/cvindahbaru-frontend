<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { watch } from 'vue'



const router = useRouter()
const step = ref(1)

// Form Data
const nama = ref('')
const email = ref('')
const telp = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const tglLahir = ref('')
const alamat = ref('')
const kotaId = ref('')
const provinsiId = ref('')
const daftarKota = ref([])
const daftarProvinsi = ref([])

// Feedback
const error = ref('')
const success = ref('')

// Step 1 Validasi
const nextStep = () => {
  error.value = ''
  if (!nama.value || !email.value || !telp.value || !username.value || !password.value || !confirmPassword.value) {
    error.value = 'Semua field harus diisi.'
    return
  }
  if (password.value.length !== 8) {
    error.value = 'Password harus tepat 8 karakter.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Konfirmasi password tidak cocok.'
    return
  }
  step.value = 2
}

// Ambil provinsi dari backend
const getProvinsi = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/rajaongkir/provinces')
console.log('DATA PROVINSI:', res.data)
daftarProvinsi.value = res.data.data


    // Jika datanya langsung berupa array (tanpa "data" wrapper)
    if (Array.isArray(res.data)) {
      daftarProvinsi.value = res.data
    } else if (Array.isArray(res.data.data)) {
      daftarProvinsi.value = res.data.data
    } else {
      error.value = 'Format data provinsi tidak valid.'
    }
  } catch (err) {
    error.value = 'Gagal mengambil daftar provinsi.'
  }
}


// Ambil kota dari backend berdasarkan provinsi
const getKota = async () => {
  if (!provinsiId.value) return
  try {
    const res = await axios.get(`http://localhost:8000/api/rajaongkir/cities/${provinsiId.value}`)
    if (Array.isArray(res.data?.data)) {
      daftarKota.value = res.data.data
    } else {
      error.value = 'Format data kota tidak valid.'
    }
  } catch (err) {
    console.error('❌ Gagal ambil kota:', err)
    error.value = 'Gagal mengambil data kota.'
  }
}


// Proses registrasi pelanggan
const register = async () => {
  error.value = ''
  success.value = ''

  if (!tglLahir.value || !alamat.value || !kotaId.value) {
    error.value = 'Alamat, kota, dan tanggal lahir wajib diisi.'
    return
  }

  try {
    const namaKota = daftarKota.value.find(k => k.city_id == kotaId.value)?.city_name || ''

    await axios.post('http://localhost:8000/api/pelanggan/add', {
      nm_plg: nama.value,
      user_plg: username.value,
      email_plg: email.value,
      no_plg: telp.value,
      pass_plg: password.value,
      tgl_lahir: tglLahir.value,
      alamat: alamat.value,
      provinsi: provinsiId.value,
      kota: kotaId.value
    })

    success.value = 'Registrasi berhasil!'
    setTimeout(() => {
      router.push('/User/UserLog/UserLog')
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat registrasi.'
  }
}

onMounted(() => {
  getProvinsi()
})
</script>

  
<template>
  <div class="w-screen h-screen flex items-center justify-center bg-[#000C] backdrop-blur-md">
    <div class="w-[90%] sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white py-6 px-5 rounded-lg shadow-lg flex flex-col items-center">
      
      <h1 class="text-3xl md:text-4xl font-semibold mb-6">Register Pelanggan</h1>

      <!-- Step 1 -->
      <div v-if="step === 1" class="flex flex-col gap-3 w-full">
        <input v-model="username" type="text" placeholder="Username" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm" />
        <input v-model="nama" type="text" placeholder="Nama Lengkap" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm" />
        <input v-model="email" type="email" placeholder="Email" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm" />
        <input v-model="telp" type="text" placeholder="No. Telepon" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm" />
        <input v-model="password" type="password" placeholder="Password (8 karakter)" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm" />
        <input v-model="confirmPassword" type="password" placeholder="Konfirmasi Password" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm" />

        <button @click="nextStep" class="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-all">
          Selanjutnya
        </button>
      </div>

      <!-- Step 2 -->
      <div v-if="step === 2" class="flex flex-col gap-3 w-full">
        <input v-model="tglLahir" type="date" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm" />
        <input v-model="alamat" type="text" placeholder="Alamat Lengkap" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm" />
        
        <select v-model="provinsiId" @change="getKota" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600">
          <option value="" disabled selected hidden>Pilih Provinsi</option>
          <option v-for="prov in daftarProvinsi" :key="prov.id" :value="prov.id">
            {{ prov.name }}
          </option>
      </select>


        <select v-model="kotaId" class="border-2 border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600">
          <option value="" disabled selected hidden>Pilih Kota</option>
          <option v-for="k in daftarKota" :key="k.id" :value="k.id">
            {{ k.name }}
          </option>
          </select>

        <button @click="register" class="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-all">
          Daftar Sekarang
        </button>
      </div>

      <!-- Error & Success -->
      <p v-if="error" class="text-red-600 text-sm mt-4">{{ error }}</p>
      <p v-if="success" class="text-green-600 text-sm mt-4">{{ success }}</p>

      <!-- Link login -->
      <p class="text-xs text-center mt-4">
        Sudah punya akun?
        <router-link to="/User/UserLog/UserLog" class="text-indigo-600 hover:underline">Login di sini</router-link>
      </p>
    </div>
  </div>
</template>
