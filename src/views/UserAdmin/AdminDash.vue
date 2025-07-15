<script setup>
import NavAdmin from '@/views/Dashboard/NavAdmin.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const profildetRef = ref(null)
const profilRef = ref(null)
const securityRef = ref(null)

const showSidebar = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)

const id_adm = ref('')
const nama = ref('')
const email = ref('')
const telp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorInfo = ref('')
const successInfo = ref('')
const isLoading = ref(true)

const router = useRouter()

function scrollTo(section) {
  const sections = {
    profildet: profildetRef,
    profil: profilRef,
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

onMounted(async () => {
  updateScreen()
  window.addEventListener('resize', updateScreen)

  // ✅ CEK LOGIN ADMIN
  const adminStr = localStorage.getItem('admin')
  if (!adminStr) {
    router.push('/UserAdmin/AdminLog/AdminLog')
    return
  }

  let admin
  try {
    admin = JSON.parse(adminStr)
  } catch (e) {
    router.push('/UserAdmin/AdminLog/AdminLog')
    return
  }

  if (!admin.id_adm) {
    router.push('/UserAdmin/AdminLog/AdminLog')
    return
  }

  id_adm.value = admin.id_adm

  const section = useRoute().query.section
  if (section) scrollTo(section)

  try {
    const res = await axios.get(`http://localhost:8000/api/admin/${id_adm.value}`)
    nama.value = res.data.nm_adm
    email.value = res.data.email_adm
    telp.value = res.data.no_adm
    isLoading.value = false
  } catch (err) {
    errorInfo.value = 'Gagal memuat data admin.'
    isLoading.value = false
  }
})

const simpanProfil = async () => {
  try {
    const data = {
      id_adm: id_adm.value,
      nm_adm: nama.value,
      email_adm: email.value,
      no_adm: telp.value
    }
    await axios.put('http://localhost:8000/api/admin/update', data)
    successInfo.value = 'Data pribadi berhasil diperbarui.'
    errorInfo.value = ''
  } catch {
    errorInfo.value = 'Gagal menyimpan data pribadi.'
    successInfo.value = ''
  }
}

const simpanPassword = async () => {
  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    errorInfo.value = 'Konfirmasi password tidak cocok.'
    successInfo.value = ''
    return
  }

  try {
    const data = {
      id_adm: id_adm.value,
      pass_adm: newPassword.value
    }
    await axios.put('http://localhost:8000/api/admin/update', data)
    successInfo.value = 'Password berhasil diperbarui.'
    errorInfo.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch {
    errorInfo.value = 'Gagal memperbarui password.'
    successInfo.value = ''
  }
}
</script>

<template>
  <div class="w-full min-h-screen flex flex-col lg:flex-row relative">
    <button class="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow" @click="showSidebar = true">
      <i class="fas fa-bars text-gray-700"></i>
    </button>

    <transition name="fade">
      <div v-if="showSidebar" class="fixed inset-0 z-40 bg-black bg-opacity-40 lg:bg-transparent lg:relative lg:z-50" @click.self="showSidebar = false">
        <div class="w-64 bg-white h-full shadow-lg absolute lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:z-50">
          <NavAdmin @navigate="scrollTo" />
          <button class="lg:hidden absolute top-4 right-4 text-gray-600" @click="showSidebar = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </transition>

    <div class="w-full flex flex-col px-4 md:px-8 py-6 space-y-12 lg:ml-64">
      <section ref="profildetRef" class="text-xl md:text-3xl font-bold py-3 border-b">
        <h1>Detail Admin</h1>
      </section>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="md:w-1/2 text-gray-600 text-sm">
          <p>Halaman ini menampilkan informasi profil Anda saat ini.</p>
        </div>
        <div class="flex flex-col gap-2 text-sm w-full">
          <div class="flex justify-between"><label>Nama Lengkap:</label><p>{{ isLoading ? 'Memuat...' : nama }}</p></div>
          <div class="flex justify-between"><label>Email:</label><p>{{ isLoading ? 'Memuat...' : email }}</p></div>
          <div class="flex justify-between"><label>No. Telp:</label><p>{{ isLoading ? 'Memuat...' : telp }}</p></div>
          <p v-if="errorInfo" class="text-red-600 text-sm">{{ errorInfo }}</p>
        </div>
      </div>

      <section ref="profilRef" class="text-xl md:text-2xl font-bold py-3 border-b">
        <h1>Informasi Pribadi</h1>
      </section>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="md:w-1/2 text-gray-600 text-sm">
          <p>Perbarui nama, email, atau nomor Anda di sini.</p>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <label class="text-sm">Nama Lengkap</label>
          <input type="text" class="w-full border rounded-md p-2 text-sm" v-model="nama" />
          <label class="text-sm">Email</label>
          <input type="email" class="w-full border rounded-md p-2 text-sm" v-model="email" />
          <label class="text-sm">Nomor Telepon</label>
          <input type="text" class="w-full border rounded-md p-2 text-sm" v-model="telp" />
          <button class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition text-sm" @click="simpanProfil">
            Simpan Perubahan
          </button>
        </div>
      </div>

      <section ref="securityRef" class="text-xl md:text-2xl font-bold py-3 border-b">
        <h1>Login & Security</h1>
      </section>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="md:w-1/2 text-gray-600 text-sm">
          <p>Pastikan akun Anda tetap aman dengan memperbarui password secara rutin.</p>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <label class="text-sm">Password Baru (opsional)</label>
          <input type="password" class="w-full border rounded-md p-2 text-sm" v-model="newPassword" />
          <label class="text-sm">Konfirmasi Password</label>
          <input type="password" class="w-full border rounded-md p-2 text-sm" v-model="confirmPassword" />
          <button class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition text-sm" @click="simpanPassword">
            Simpan Password
          </button>
          <p v-if="successInfo" class="text-green-600 text-sm">{{ successInfo }}</p>
          <p v-if="errorInfo" class="text-red-600 text-sm">{{ errorInfo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
