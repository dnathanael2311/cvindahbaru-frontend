<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Roulette } from 'vue3-roulette'

const wheel = ref(null)
const spinning = ref(false)
const result = ref('')
const lastIndex = ref(-1)
const router = useRouter()

const id_plg = localStorage.getItem('id_plg')
const canSpin = ref(false)
const loading = ref(true)

// 🎁 Daftar hadiah
const items = [
  { id: 1, value: '10.00', jenis: 'Ongkir', htmlContent: '10% Diskon Ongkir' },
  { id: 2, value: '15.00', jenis: 'Ongkir', htmlContent: '15% Diskon Ongkir' },
  { id: 3, value: '100.00', jenis: 'Ongkir', htmlContent: '100% Diskon Ongkir' },
  { id: 4, value: '10.00', jenis: 'Total', htmlContent: '10% Diskon Total Harga' },
  { id: 5, value: '15.00', jenis: 'Total', htmlContent: '15% Diskon Total Harga' },
]

// 🔁 Spin
function launchWheel() {
  if (wheel.value && !spinning.value && canSpin.value) {
    spinning.value = true
    result.value = ''
    const randomIndex = Math.floor(Math.random() * items.length)
    lastIndex.value = randomIndex
    wheel.value.launchWheel(randomIndex)
  }
}

// 🎯 Saat mulai
function onStart() {
  console.log('🎯 Memutar roda...')
}

// 🏁 Saat selesai
async function onEnd() {
  spinning.value = false
  const index = lastIndex.value

  if (index < 0 || index >= items.length) {
    result.value = 'Tidak diketahui'
    console.warn('⚠️ Index hadiah tidak valid:', index)
    return
  }

  const hadiah = items[index]
  result.value = `${hadiah.value} ${hadiah.jenis}`

  try {
    await axios.post('https://cvindahbaru.com/api/api/reward/add', {
      id_plg,
      jenis_rwd: hadiah.jenis, // ⬅️ langsung "Ongkir" atau "Total"
      value_rwd: hadiah.value,
    })
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem(`roulette_done_${today}_${id_plg}`, '1')
    console.log('✅ Reward berhasil disimpan')

  } catch (err) {
    if (err.response?.status === 409) {
      alert('⚠️ Kamu sudah klaim reward hari ini.')
    }
    console.error('❌ Gagal simpan reward:', err.response?.data || err.message)
  }

  await nextTick()
  setTimeout(() => {
    router.push('/')
  }, 2000)
}

// ✅ Cek ulang tahun dan status reward
onMounted(async () => {
  if (!id_plg) {
    router.push('/Login')
    return
  }

  const todayStr = new Date().toISOString().slice(0, 10)
  const localKey = `roulette_done_${todayStr}_${id_plg}`

  if (localStorage.getItem(localKey)) {
    canSpin.value = false
    loading.value = false
    return
  }

  try {
    const { data: pelanggan } = await axios.get(`https://cvindahbaru.com/api/api/pelanggan/${id_plg}`)

    const today = new Date()
    const birth = new Date(pelanggan.tgl_lahir)
    const isBirthday = today.getDate() === birth.getDate() && today.getMonth() === birth.getMonth()

    if (!isBirthday) {
      router.push('/')
      return
    }

    const { data } = await axios.get('https://cvindahbaru.com/api/api/reward/check-today', {
      params: { id_plg }
    })

    canSpin.value = !data.alreadyClaimed
  } catch (err) {
    console.error('❌ Gagal validasi ulang tahun:', err.response?.data || err.message)
    canSpin.value = false
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
    <h1 class="text-white text-3xl font-bold mb-6">🎁 Putar & Menangkan Hadiah</h1>

    <div v-if="loading" class="text-white">Memuat...</div>

    <div v-else>
      <div class="w-72 h-72 relative">
        <Roulette
          ref="wheel"
          :items="items"
          @wheel-start="onStart"
          @wheel-end="onEnd"
          :default-style="true"
        />
      </div>

      <button
        @click="launchWheel"
        class="mt-6 bg-white text-purple-600 px-6 py-2 rounded-lg shadow hover:bg-purple-100 transition"
        :disabled="spinning || !canSpin"
      >
        {{ spinning ? 'Memutar...' : canSpin ? '🎡 Spin Sekarang' : '❌ Tidak Bisa Spin' }}
      </button>

      <div v-if="result" class="mt-6 text-white text-xl font-semibold text-center">
        🎉 Kamu mendapatkan: <span class="underline">{{ result }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* style tambahan jika perlu */
</style>
