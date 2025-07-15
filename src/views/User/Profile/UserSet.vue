<script setup>
import NavSetting from '@/views/Dashboard/NavSetting.vue'
import Navbar from '@/views/Dashboard/Navbar.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const profildetRef = ref(null)
const profilRef = ref(null)
const alamatRef = ref(null)
const securityRef = ref(null)

const showSidebar = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)

const id_plg = ref('')
const nama = ref('')
const email = ref('')
const telp = ref('')
const tgl_lahir = ref('')
const alamat = ref('')
const provinsiId = ref('')
const kotaId = ref('')

const daftarProvinsi = ref([])
const daftarKota = ref([])

const newPassword = ref('')
const confirmPassword = ref('')

const errorInfo = ref('')
const successInfo = ref('')
const errorPwdInfo = ref('')
const successPwdInfo = ref('')
const isLoading = ref(true)

function scrollTo(section) {
  const sections = {
    profildet: profildetRef,
    profil: profilRef,
    alamat: alamatRef,
    security: securityRef
  }
  const target = sections[section]
  if (target?.value) {
    target.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const updateScreen = () => {
  isDesktop.value = window.innerWidth >= 1024
  showSidebar.value = isDesktop.value
}

const onResize = () => updateScreen()

const getProvinsi = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/rajaongkir/provinces')
    daftarProvinsi.value = res.data?.data || []
  } catch (err) {
    errorInfo.value = 'Gagal memuat data provinsi.'
  }
}

const getKota = async () => {
  if (!provinsiId.value) return
  try {
    const res = await axios.get(`http://localhost:8000/api/rajaongkir/cities/${provinsiId.value}`)
    daftarKota.value = res.data?.data || []
  } catch (err) {
    errorInfo.value = 'Gagal memuat data kota.'
  }
}

const getNamaProvinsi = (id) => {
  const prov = daftarProvinsi.value.find(p => p.id == id)
  return prov ? prov.name : ''
}

const getNamaKota = (id) => {
  const kota = daftarKota.value.find(k => k.id == id)
  return kota ? kota.name : ''
}

onMounted(async () => {
  updateScreen()
  window.addEventListener('resize', onResize)

  const section = useRoute().query.section
  if (section) scrollTo(section)

  const id = localStorage.getItem('id_plg')
  if (!id) {
    errorInfo.value = 'ID pelanggan tidak ditemukan di localStorage.'
    isLoading.value = false
    return
  }

  id_plg.value = id

  try {
    const res = await axios.get(`http://localhost:8000/api/pelanggan/${id_plg.value}`)
    nama.value = res.data.nm_plg || ''
    email.value = res.data.email_plg || ''
    telp.value = res.data.no_plg || ''
    tgl_lahir.value = res.data.tgl_lahir || ''
    alamat.value = res.data.alamat || ''
    provinsiId.value = res.data.provinsi || ''
    kotaId.value = res.data.kota || ''

    await getProvinsi()
    await getKota()
  } catch (err) {
    errorInfo.value = 'Gagal memuat data pelanggan.'
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const simpanProfil = async () => {
  errorInfo.value = ''
  successInfo.value = ''

  try {
    const data = {
      id_plg: id_plg.value,
      nm_plg: nama.value,
      tgl_lahir: tgl_lahir.value,
      email_plg: email.value,
      alamat: alamat.value,
      provinsi: provinsiId.value,
      kota: kotaId.value,
      no_plg: telp.value
    }

    await axios.post('http://localhost:8000/api/pelanggan/update', data)
    successInfo.value = 'Data pribadi berhasil diperbarui.'
  } catch (e) {
    errorInfo.value = 'Gagal menyimpan data pribadi.'
  }
}

const simpanPassword = async () => {
  errorPwdInfo.value = ''
  successPwdInfo.value = ''

  if (!newPassword.value) {
    errorPwdInfo.value = 'Password baru tidak boleh kosong.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorPwdInfo.value = 'Konfirmasi password tidak cocok.'
    return
  }

  try {
    const data = {
      id_plg: id_plg.value,
      pass_plg: newPassword.value
    }

    await axios.put('http://localhost:8000/api/pelanggan/update', data)
    successPwdInfo.value = 'Password berhasil diperbarui.'
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e) {
    errorPwdInfo.value = 'Gagal memperbarui password.'
  }
}
</script>

<template>
  <div class="relative group">
    <div class="h-6 bg-transparent"></div>
    <div class="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
      <Navbar />
    </div>
  </div>

  <div class="w-full min-h-screen flex flex-col lg:flex-row">
    <div class="w-full lg:w-1/5 flex">
      <NavSetting @navigate="scrollTo" />
    </div>

    <div class="w-full lg:w-4/5 flex flex-col px-4 md:px-8 py-6 space-y-12">
      <!-- Detail Saya -->
      <section ref="profildetRef" class="text-2xl md:text-4xl font-bold py-5 border-b">
        <h1>Detail Saya</h1>
      </section>
      <div class="flex flex-col md:flex-row gap-4 p-3">
        <div class="md:w-1/2 text-gray-600">
          <p>Halaman ini menampilkan informasi profil Anda saat ini.</p>
        </div>
        <div class="md:w-1/2">
          <p><strong>Nama Lengkap :</strong> {{ isLoading ? 'Memuat...' : nama }}</p>
          <p><strong>Email :</strong> {{ isLoading ? 'Memuat...' : email }}</p>
          <p><strong>No. Telp :</strong> {{ isLoading ? 'Memuat...' : telp }}</p>
          <p><strong>Alamat :</strong> {{ isLoading ? 'Memuat...' : alamat }}</p>
          <p><strong>Kota :</strong> {{ isLoading ? 'Memuat...' : getNamaKota(kotaId) }}</p>
          <p><strong>Provinsi :</strong> {{ isLoading ? 'Memuat...' : getNamaProvinsi(provinsiId) }}</p>
          <p v-if="errorInfo" class="text-red-600 text-sm mt-2">{{ errorInfo }}</p>
        </div>
      </div>

      <!-- Informasi Pribadi -->
      <section ref="profilRef" class="text-xl md:text-2xl font-bold py-5 border-b">
        <h1>Informasi Pribadi</h1>
      </section>
      <div class="flex flex-col md:flex-row gap-4 p-3">
        <div class="md:w-1/2 text-gray-600">
          <p>Kelola informasi akun Anda seperti nama, email, dan nomor telepon.</p>
        </div>
        <div class="md:w-1/2 flex flex-col gap-2">
          <label>Nama Lengkap</label>
          <input type="text" v-model="nama" class="border p-2 rounded" />
          <label>Email</label>
          <input type="email" v-model="email" class="border p-2 rounded" />
          <label>Nomor Telepon</label>
          <input type="text" v-model="telp" class="border p-2 rounded" />
          <label>Tanggal Lahir</label>
          <input type="date" v-model="tgl_lahir" class="border p-2 rounded" />
          <button @click="simpanProfil" class="bg-indigo-600 text-white px-4 py-2 mt-4 rounded hover:bg-indigo-700">
            Simpan Perubahan
          </button>
          <p v-if="successInfo" class="text-green-600 text-sm mt-2">{{ successInfo }}</p>
          <p v-if="errorInfo" class="text-red-600 text-sm mt-2">{{ errorInfo }}</p>
        </div>
      </div>

      <!-- Alamat -->
      <section ref="alamatRef" class="text-xl md:text-2xl font-bold py-5 border-b">
        <h1>Alamat</h1>
      </section>
      <div class="flex flex-col md:flex-row gap-4 p-3">
        <div class="md:w-1/2 text-gray-600">
          <p>Pastikan alamat lengkap Anda sesuai agar proses pengiriman berjalan lancar.</p>
        </div>
        <div class="md:w-1/2 flex flex-col gap-2">
          <label>Alamat Lengkap</label>
          <input type="text" v-model="alamat" class="border p-2 rounded" />
          <label>Provinsi</label>
          <select v-model="provinsiId" @change="getKota" class="border p-2 rounded text-gray-600">
            <option value="" disabled selected hidden>Pilih Provinsi</option>
            <option v-for="prov in daftarProvinsi" :key="prov.id" :value="prov.id">
              {{ prov.name }}
            </option>
          </select>
          <label>Kota</label>
          <select v-model="kotaId" class="border p-2 rounded text-gray-600">
            <option value="" disabled selected hidden>Pilih Kota</option>
            <option v-for="k in daftarKota" :key="k.id" :value="k.id">
              {{ k.name }}
            </option>
          </select>
          <button @click="simpanProfil" class="bg-indigo-600 text-white px-4 py-2 mt-4 rounded hover:bg-indigo-700">
            Simpan Alamat
          </button>
        </div>
      </div>

      <!-- Security -->
      <section ref="securityRef" class="text-xl md:text-2xl font-bold py-5 border-b">
        <h1>Login & Security</h1>
      </section>
      <div class="flex flex-col md:flex-row gap-4 p-3">
        <div class="md:w-1/2 text-gray-600">
          <p>Perbarui kata sandi Anda secara berkala untuk keamanan akun.</p>
        </div>
        <div class="md:w-1/2 flex flex-col gap-2">
          <label>Password Baru</label>
          <input type="password" v-model="newPassword" class="border p-2 rounded" />
          <label>Konfirmasi Password</label>
          <input type="password" v-model="confirmPassword" class="border p-2 rounded" />
          <button @click="simpanPassword" class="bg-indigo-600 text-white px-4 py-2 mt-4 rounded hover:bg-indigo-700">
            Simpan Password
          </button>
          <p v-if="successPwdInfo" class="text-green-600 text-sm mt-2">{{ successPwdInfo }}</p>
          <p v-if="errorPwdInfo" class="text-red-600 text-sm mt-2">{{ errorPwdInfo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
