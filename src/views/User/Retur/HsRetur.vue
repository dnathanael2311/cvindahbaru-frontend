<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import NavSetting from '@/views/Dashboard/NavSetting.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const daftarRetur = ref([])
const id_plg = localStorage.getItem('id_plg')
console.log('ID Pelanggan dari localStorage:', id_plg)

const fetchRetur = async () => {
  try {
    // Ambil order berdasarkan id_plg
    const ordersRes = await axios.get('https://cvindahbaru.com/api/api/order', {
      params: { id_plg }
    })
    const idOrders = ordersRes.data.map(order => order.id_order)

    if (idOrders.length === 0) {
      daftarRetur.value = []
      return
    }

    // Ambil retur berdasarkan id_order
    const returRes = await axios.get('https://cvindahbaru.com/api/api/retur/by-orders', {
  params: {
    id_orders: idOrders // ini array seperti [1,2,3]
  },
  paramsSerializer: params => {
    return params.id_orders.map(id => `id_orders[]=${id}`).join('&')
  }
})


    daftarRetur.value = returRes.data
  } catch (err) {
    console.error('Gagal memuat data retur', err)
  }
}

onMounted(fetchRetur)
</script>


<template>
  <div class="min-h-screen bg-white flex flex-col lg:flex-row">
    <aside class="w-full lg:w-1/5 flex-shrink-0">
      <div class="w-full">
        <NavSetting />
      </div>
    </aside>

    <div class="w-full lg:w-4/5 p-4 sm:p-6">
      <div class="max-w-6xl mx-auto w-full">
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">Riwayat Retur</h1>

        <!-- TABEL UNTUK DESKTOP -->
        <div class="hidden sm:block overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
          <table class="min-w-full text-sm sm:text-base text-left text-gray-700">
            <thead class="bg-indigo-600 text-white uppercase text-sm">
              <tr>
                <th class="px-4 py-2">ID Retur</th>
                <th class="px-4 py-2">ID Order</th>
                <th class="px-4 py-2">Tanggal Retur</th>
                <th class="px-4 py-2">Status Retur</th>
                <th class="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="retur in daftarRetur" :key="retur.id_rt" class="border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">{{ retur.id_rt }}</td>
                <td class="px-6 py-4">{{ retur.id_order }}</td>
                <td class="px-6 py-4">{{ retur.tgl_rt }}</td>
                <td class="px-6 py-4">{{ retur.st_retur }}</td>
                <td class="px-6 py-4">
                  <router-link
                    :to="`/User/Retur/DetailRetur?id_rt=${retur.id_rt}`"
                    class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md shadow-md transition text-sm"
                  >
                    Lihat Detail
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MOBILE VERSION -->
        <div class="sm:hidden space-y-4 mt-6">
          <div
            v-for="retur in daftarRetur"
            :key="'mobile-' + retur.id_rt"
            class="bg-white rounded-lg shadow-md border border-gray-200 p-4"
          >
            <div class="mb-2">
              <span class="font-semibold">ID Retur:</span> {{ retur.id_rt }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">ID Transaksi:</span> {{ retur.id_order }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Tanggal Retur:</span> {{ retur.tgl_rt }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Deskripsi:</span> <i>lihat di detail</i>
            </div>
            <div class="mb-4">
              <span class="font-semibold">Status Retur:</span> {{ retur.st_retur }}
            </div>
            <div class="flex gap-2">
              <router-link
                :to="`/User/Retur/DetailRetur?id_rt=${retur.id_rt}`"
                class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Lihat
              </router-link>
            </div>
          </div>
        </div>
      </div> <!-- End of max-w-6xl -->
    </div>
  </div>
</template>
