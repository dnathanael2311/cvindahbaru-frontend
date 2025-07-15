<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import NavSetting from '@/views/Dashboard/NavSetting.vue'
import Router from '@/router/index.js'
const orders = ref([])
const selectedOrder = ref(null)

const fetchOrders = async () => {
  try {
    const response = await axios.get('https://cvindahbaru.com/api/api/order')
    console.log('Data dari API:', response.data) // 👈 Tambah ini
    orders.value = response.data
  } catch (error) {
    console.error('Gagal mengambil data order:', error)
  }
}

const lihatDetail = (order) => {
  selectedOrder.value = order
}

onMounted(() => {
  fetchOrders()
})
</script>


<template>
  <div class="w-full flex flex-col lg:flex-row">
    <div class="w-full lg:w-1/5 flex">
      <div class="w-full">
        <NavSetting />
      </div>
    </div>

    <div class="w-full lg:w-4/5 max-w-6xl mx-auto py-10 px-4 sm:px-6">
      <h1 class="text-3xl font-semibold text-gray-800 mb-6">Riwayat Transaksi</h1>

      <div class="hidden sm:block overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table class="min-w-full bg-white text-sm text-left text-gray-700">
          <thead class="bg-indigo-600 text-white text-sm uppercase">
            <tr>
              <th class="px-4 md:px-6 py-3">ID Checkout</th>
              <th class="px-4 md:px-6 py-3">Nama Pelanggan</th>
              <th class="px-4 md:px-6 py-3">Alamat</th>
              <th class="px-4 md:px-6 py-3">Kurir</th>
              <th class="px-4 md:px-6 py-3">Total Harga</th>
              <th class="px-4 md:px-6 py-3">Tanggal</th>
              <th class="px-4 md:px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="order in orders" :key="order.id_order" class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">#{{ order.id_checkout }}</td>
              <td class="px-6 py-4">{{ order.pelanggan?.nm_plg ?? '-' }}</td>
              <td class="px-6 py-4">{{ order.pelanggan?.alamat ?? '-' }}</td>
              <td class="px-6 py-4">{{ order.checkout?.kurir ?? '-' }}</td>
              <td class="px-6 py-4">Rp {{ Number(order.checkout?.ttl_harga ?? 0).toLocaleString('id-ID') }}</td>
              <td class="px-6 py-4">{{ order.created_at?.slice(0, 10) ?? '-' }}</td>
              <td class="px-6 py-4 flex gap-x-2">
                <router-link :to="`/user/order/${order.id_order}`" class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md shadow">Lihat</router-link>
                <router-link :to="`/User/Retur/${order.id_order}`" class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md shadow">Retur</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="sm:hidden space-y-4 mt-6">
        <div
          v-for="order in orders"
          :key="order.id_order"
          class="bg-white rounded-lg shadow-md border border-gray-200 p-4"
        >
          <div class="mb-2">
            <span class="font-semibold">ID Checkout:</span> #{{ order.id_checkout }}
          </div>
          <div class="mb-2">
            <span class="font-semibold">Nama Pelanggan:</span> {{ order.pelanggan?.nama ?? '-' }}
          </div>
          <div class="mb-2">
            <span class="font-semibold">Alamat:</span> {{ order.pelanggan?.alamat ?? '-' }}
          </div>
          <div class="mb-2">
            <span class="font-semibold">Kurir:</span> {{ order.checkout?.kurir ?? '-' }}
          </div>
          <div class="mb-2">
            <span class="font-semibold">Total Harga:</span> Rp
            {{ Number(order.checkout?.total_harga ?? 0).toLocaleString('id-ID') }}
          </div>
          <div class="mb-2">
            <span class="font-semibold">Tanggal:</span>
            {{ order.created_at?.slice(0, 10) ?? '-' }}
          </div>
          <div class="flex gap-2 mt-4">
          <router-link :to="`/user/order/${order.id_order}`" class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md shadow">
            Lihat
          </router-link>
          <router-link :to="`/User/Retur/${order.id_order}`" class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md shadow">
            Retur
          </router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
