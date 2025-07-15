<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const goBack = () => router.back()

const id_rt = route.query.id_rt
const detailRetur = ref([])
const tglRetur = ref('')
const alasan = ref('-')
const idTransaksi = ref('') // Akan menampilkan ID ORDER

const fetchDetailRetur = async () => {
  try {
    // Ambil detail retur dan barang
    const detailRes = await axios.get('https://cvindahbaru.com/api/api/detailretur/byretur', {
      params: { id_rt }
    })
    detailRetur.value = detailRes.data
    alasan.value = detailRetur.value[0]?.alasan || '-'

    // Ambil data retur + relasi order + checkout
    const returRes = await axios.get('https://cvindahbaru.com/api/api/retur/show', {
      params: { id_rt }
    })

    const data = returRes.data
    tglRetur.value = data.tgl_rt

    // Gunakan ID ORDER sebagai ID Transaksi
    idTransaksi.value = 'ORDER-' + data.id_order.toString().padStart(5, '0')
  } catch (err) {
    console.error('Gagal memuat detail retur', err)
  }
}

onMounted(fetchDetailRetur)
</script>

<template>
  <div class="min-h-screen w-full bg-black/60 backdrop-blur-md flex justify-center items-center px-3 sm:px-6 py-6">
    <div class="w-full max-w-3xl bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-10 overflow-y-auto max-h-[90vh]">
      <div class="w-full font-bold text-lg sm:text-xl md:text-2xl pb-4 border-b">
        <h1>Detail Retur</h1>
        <button @click="goBack" class="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium">
          ← Kembali
        </button>
      </div>

      <!-- ID Transaksi -->
      <div class="w-full font-semibold text-sm sm:text-base md:text-lg pt-4">
        <h1>ID Transaksi :</h1>
        <p class="text-gray-600 font-light text-xs sm:text-sm">{{ idTransaksi }}</p>
      </div>

      <!-- Tabel Barang -->
      <div class="w-full mt-4">
        <div class="bg-white rounded-lg shadow border p-3 sm:p-5 max-h-[300px] sm:max-h-[400px] overflow-auto">
          <table class="min-w-full text-xs sm:text-sm md:text-base">
            <thead>
              <tr class="text-left text-gray-500 uppercase border-b">
                <th class="px-2 sm:px-4 py-2">Nama Barang</th>
                <th class="px-2 sm:px-4 py-2">Qty</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="item in detailRetur" :key="item.id_brg" class="hover:bg-gray-50">
                <td class="px-2 sm:px-4 py-3">
                  <div class="flex flex-col space-y-1">
                    <p class="text-gray-700 text-sm">{{ item.barang.nm_brg }}</p>
                  </div>
                </td>
                <td class="px-2 sm:px-4 py-3 font-semibold text-yellow-500 text-sm sm:text-base md:text-lg">
                  {{ item.qty_rt }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tanggal dan Alasan -->
      <div class="w-full flex flex-col text-left pt-6 gap-4">
        <div class="font-semibold text-sm sm:text-base md:text-lg">
          <h1>Alasan Retur :</h1>
          <p class="font-light text-xs sm:text-sm md:text-base">{{ alasan }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
