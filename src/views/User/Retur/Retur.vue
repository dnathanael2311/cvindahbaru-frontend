<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const idOrder = route.params.id_order
const isLoading = ref(false)
const isFetching = ref(true)
const isEmpty = ref(false)
const daftarBarang = ref([])
const alasanRetur = reactive({})

const fetchDetailOrder = async () => {
  isFetching.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/order/detail', {
      params: { id_order: idOrder }
    })

    daftarBarang.value = res.data.map(item => ({
      ...item,
      qty_rt: 0,
      max_qty: item.dor_qty
    }))

    isEmpty.value = daftarBarang.value.length === 0
  } catch (err) {
    console.error('Gagal mengambil detail order:', err)
    isEmpty.value = true
  } finally {
    isFetching.value = false
  }
}

const tambahQty = (item) => {
  if (item.qty_rt < item.max_qty) item.qty_rt++
}
const kurangQty = (item) => {
  if (item.qty_rt > 0) item.qty_rt--
}

const ajukanRetur = async () => {
  const barangDiretur = daftarBarang.value.filter(i => i.qty_rt > 0)

  if (barangDiretur.length === 0) {
    alert('Silakan pilih minimal satu barang untuk diretur.')
    return
  }

  for (const barang of barangDiretur) {
    if (barang.qty_rt > barang.max_qty) {
      alert(`Qty retur untuk ${barang.barang?.nm_brg ?? '-'} melebihi qty pembelian.`)
      return
    }
    if (!alasanRetur[barang.id_brg] || alasanRetur[barang.id_brg].trim() === '') {
      alert(`Mohon isi alasan retur untuk barang ${barang.barang?.nm_brg ?? '-'}.`)
      return
    }
  }

  isLoading.value = true

  try {
    const { data: retur } = await axios.post('http://localhost:8000/api/retur/add', {
      id_order: idOrder,
      tgl_rt: new Date().toISOString().slice(0, 10),
      st_retur: 'Diproses'
    })

    const id_rt = retur.id_rt

    const detailPromises = barangDiretur.map(barang =>
      axios.post('http://localhost:8000/api/detailretur/add', {
        id_rt,
        id_brg: barang.id_brg,
        qty_rt: barang.qty_rt,
        alasan: alasanRetur[barang.id_brg].trim()
      })
    )

    await Promise.all(detailPromises)

    alert('Retur berhasil diajukan.')

    // Navigasi dengan error handler
    router.push('/User/Retur/HsRetur').catch(err => {
      console.error('Navigasi gagal:', err)
    })
  } catch (err) {
    console.error('Gagal mengirim retur:', err)
    alert('Terjadi kesalahan saat mengirim retur.')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDetailOrder)
</script>

<template>
  <div class="w-screen min-h-screen bg-black/60 backdrop-blur-md flex justify-center items-center px-3 py-6">
    <div class="w-full max-w-3xl bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Pengajuan Retur</h1>

      <!-- Tabel Barang -->
      <div class="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <table class="min-w-full text-xs sm:text-sm md:text-base">
          <thead>
            <tr class="text-left text-gray-500 uppercase border-b">
              <th class="px-2 sm:px-4 py-2">Gambar</th>
              <th class="px-2 sm:px-4 py-2">Nama Barang</th>
              <th class="px-2 sm:px-4 py-2">Qty Retur</th>
            </tr>
          </thead>

          <tbody v-if="isFetching">
            <tr>
              <td colspan="3" class="text-center py-6 text-sm text-gray-500">
                Memuat data barang...
              </td>
            </tr>
          </tbody>

          <tbody v-else-if="isEmpty">
            <tr>
              <td colspan="3" class="text-center py-6 text-sm text-gray-500">
                Tidak ada data barang untuk retur.
              </td>
            </tr>
          </tbody>

          <tbody v-else class="divide-y">
            <tr v-for="item in daftarBarang" :key="item.id_brg" class="hover:bg-gray-50">
              <td class="px-2 sm:px-4 py-4">
                <img
                  :src="`http://localhost:8000/storage/${item.barang?.img}`"
                  alt="gambar"
                  class="w-16 h-16 object-contain rounded-md"
                />
              </td>
              <td class="px-2 sm:px-4 py-4">
                <div class="font-semibold">{{ item.barang?.nm_brg ?? '-' }}</div>
                <p class="text-gray-500 text-xs">Qty dibeli: {{ item.max_qty }}</p>
              </td>
              <td class="px-2 sm:px-4 py-4">
                <div class="inline-flex items-center border border-gray-300 rounded">
                  <button @click="kurangQty(item)" class="px-2 sm:px-3 py-1 hover:bg-gray-100">–</button>
                  <span class="px-3 sm:px-4">{{ item.qty_rt }}</span>
                  <button @click="tambahQty(item)" class="px-2 sm:px-3 py-1 hover:bg-gray-100">+</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Form Alasan Retur Selalu Muncul -->
      <div class="w-full border border-indigo-200 rounded-lg p-4 bg-gray-50 mt-6">
        <div
          v-for="item in daftarBarang"
          :key="'alasan-' + item.id_brg"
          class="mb-4"
        >
          <label class="font-medium block mb-1 text-sm sm:text-base">
            Alasan Retur untuk {{ item.barang?.nm_brg ?? '-' }}
          </label>
          <textarea
            v-model="alasanRetur[item.id_brg]"
            rows="3"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:ring-indigo-500 focus:outline-none resize-none"
            placeholder="Isi alasan retur..."
          />
        </div>

        <div class="flex justify-center mt-4">
          <button
            @click="ajukanRetur"
            :disabled="isLoading"
            class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base px-4 py-2 rounded shadow disabled:opacity-50"
          >
            {{ isLoading ? 'Mengirim...' : 'Ajukan Retur' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
