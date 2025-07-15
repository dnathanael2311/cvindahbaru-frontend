<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import NavAdmin from '@/views/Dashboard/NavAdmin.vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const sidebarOpen = ref(false)
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value
const closeSidebar = () => sidebarOpen.value = false

const startDate = ref('')
const endDate = ref('')
const daftarOrder = ref([])

const totalTransaksi = ref(0)
const totalPelanggan = ref(0)
const totalPengiriman = ref(0)
const totalOmzet = ref(0)

const chartData = ref({
  labels: [],
  datasets: []
})
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: false }
  },
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return Number.isInteger(value) ? value : ''
        }
      }
    }
  }
})

const hitungStatistik = (orders) => {
  totalTransaksi.value = orders.length
  const pelangganSet = new Set()
  let totalHarga = 0
  let totalKirim = 0

  orders.forEach(order => {
    if (order.pelanggan?.id_plg) pelangganSet.add(order.pelanggan.id_plg)
    if (order.checkout?.ttl_harga) totalHarga += Number(order.checkout.ttl_harga)
    if (order.checkout?.kurir) totalKirim++
  })

  totalPelanggan.value = pelangganSet.size
  totalPengiriman.value = totalKirim
  totalOmzet.value = totalHarga
}

const buildChartData = (orders) => {
  const mapTanggal = new Map()

  orders.forEach(order => {
    const rawTanggal = order.checkout?.tgl_checkout
    if (rawTanggal) {
      const tgl = new Date(rawTanggal).toLocaleDateString('id-ID')
      const count = parseInt(mapTanggal.get(tgl) || 0)
      mapTanggal.set(tgl, count + 1)
    }
  })

  const labels = Array.from(mapTanggal.keys()).sort((a, b) => {
    const d1 = new Date(a.split('/').reverse().join('-'))
    const d2 = new Date(b.split('/').reverse().join('-'))
    return d1 - d2
  })
  const values = labels.map(label => mapTanggal.get(label))

  chartData.value = {
    labels,
    datasets: [
      {
        label: 'Transaksi per Hari',
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
        data: values,
        fill: false,
        tension: 0.4
      }
    ]
  }
}

const fetchOrder = async () => {
  try {
    const res = await axios.get('https://cvindahbaru.com/api/api/order')
    let data = res.data

    if (startDate.value && endDate.value) {
      const start = new Date(startDate.value)
      const end = new Date(endDate.value)
      end.setHours(23, 59, 59, 999)

      data = data.filter(order => {
        const tgl = new Date(order.checkout?.tgl_checkout)
        return tgl >= start && tgl <= end
      })
    }

    daftarOrder.value = data
    hitungStatistik(data)
    buildChartData(data)
  } catch (error) {
    console.error('Gagal mengambil data order:', error)
  }
}

const filterOrder = () => {
  fetchOrder()
}

onMounted(fetchOrder)
</script>

<template>
  <div class="w-full min-h-screen flex flex-col md:flex-row bg-gray-50">
    <div class="md:hidden flex justify-between items-center bg-indigo-600 text-white px-4 py-3 shadow-md">
      <h1 class="text-lg font-semibold">Laporan Transaksi</h1>
      <button @click="toggleSidebar">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <div :class="['bg-white w-3/4 max-w-xs h-full fixed top-0 left-0 z-50 transition-transform duration-300',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0 md:fixed md:top-0 md:left-0 md:block md:w-1/5 md:h-screen md:z-40']">
      <div class="md:hidden p-4">
        <button @click="closeSidebar" class="text-gray-600 hover:text-indigo-800">Tutup Menu</button>
      </div>
      <NavAdmin />
    </div>

    <div class="flex-1 py-6 px-4 md:px-6 md:pl-[20%]">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 text-center md:text-left">
        Daftar Laporan Transaksi
      </h1>

      <!-- Filter -->
      <div class="flex flex-col sm:flex-row gap-3 sm:items-center mt-4">
        <label class="text-sm font-medium text-gray-700">Filter Tanggal:</label>
        <input type="date" v-model="startDate" class="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-auto" />
        <span class="text-sm text-gray-500">s/d</span>
        <input type="date" v-model="endDate" class="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-auto" />
        <button @click="filterOrder" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">Terapkan</button>
      </div>

      <!-- Grafik -->
      <div class="bg-white border border-gray-200 shadow rounded-lg p-4 mt-6">
        <Line :data="chartData" :options="chartOptions" />
      </div>

      <!-- Statistik -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-white border border-gray-200 shadow rounded-lg p-4 text-center">
          <p class="text-sm text-gray-500 mb-1">Total Transaksi</p>
          <p class="text-xl font-bold text-indigo-600">{{ totalTransaksi }}</p>
        </div>
        <div class="bg-white border border-gray-200 shadow rounded-lg p-4 text-center">
          <p class="text-sm text-gray-500 mb-1">Total Pelanggan</p>
          <p class="text-xl font-bold text-indigo-600">{{ totalPelanggan }}</p>
        </div>
        <div class="bg-white border border-gray-200 shadow rounded-lg p-4 text-center">
          <p class="text-sm text-gray-500 mb-1">Total Pengiriman</p>
          <p class="text-xl font-bold text-indigo-600">{{ totalPengiriman }}</p>
        </div>
        <div class="bg-white border border-gray-200 shadow rounded-lg p-4 text-center">
          <p class="text-sm text-gray-500 mb-1">Total Omzet</p>
          <p class="text-xl font-bold text-green-600">Rp {{ totalOmzet.toLocaleString('id-ID') }}</p>
        </div>
      </div>

      <!-- Tabel -->
      <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white mt-6">
        <table class="min-w-full bg-white text-sm md:text-base text-left text-gray-700">
          <thead class="bg-indigo-600 text-white text-xs md:text-sm uppercase">
            <tr>
              <th class="px-4 md:px-6 py-3">ID Order</th>
              <th class="px-4 md:px-6 py-3">Nama Pelanggan</th>
              <th class="px-4 md:px-6 py-3">Alamat</th>
              <th class="px-4 md:px-6 py-3">Kurir</th>
              <th class="px-4 md:px-6 py-3">Total Harga</th>
              <th class="px-4 md:px-6 py-3">Tanggal</th>
              <th class="px-4 md:px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in daftarOrder" :key="order.id_order" class="border-b hover:bg-gray-50">
              <td class="px-4 md:px-6 py-4 font-medium text-gray-900">{{ order.id_order }}</td>
              <td class="px-4 md:px-6 py-4">{{ order.pelanggan?.nm_plg || '-' }}</td>
              <td class="px-4 md:px-6 py-4">{{ order.pelanggan?.alamat || '-' }}</td>
              <td class="px-4 md:px-6 py-4">{{ order.checkout?.kurir || '-' }}</td>
              <td class="px-4 md:px-6 py-4">Rp {{ Number(order.checkout?.ttl_harga || 0).toLocaleString('id-ID') }}</td>
              <td class="px-4 md:px-6 py-4">{{ new Date(order.checkout?.tgl_checkout).toLocaleDateString('id-ID') }}</td>
              <td class="px-4 md:px-6 py-4">
                <router-link :to="`/UserAdmin/Laporan/DetailPenjualan?id=${order.id_order}`">Lihat Detail</router-link>
              </td>
            </tr>
            <tr v-if="daftarOrder.length === 0">
              <td colspan="7" class="text-center text-gray-500 py-4">Belum ada data transaksi</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
