<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const idTransaksi = route.query.id || 1 // pakai dari URL, fallback 1

const invoiceData = ref(null)

const fetchInvoice = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/checkout/invoice`, {
      params: { id_checkout: idTransaksi }
    })
    invoiceData.value = res.data
  } catch (err) {
    console.error('Gagal ambil data invoice:', err)
  }
}

onMounted(() => {
  fetchInvoice()

  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
  document.head.appendChild(script)
})

const downloadPDF = () => {
  const element = document.getElementById('invoiceContent')
  const opt = {
    margin: 0.5,
    filename: 'invoice.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  window.html2pdf().set(opt).from(element).save()
}
</script>


<template>
  <div class="min-h-screen w-full bg-[#000C] backdrop-blur-md flex justify-center items-start py-8 px-4 overflow-auto">
    <div id="invoiceContent" class="w-full max-w-2xl bg-white p-6 rounded shadow flex flex-col gap-y-4">
      <div class="flex flex-col gap-y-3">
        <div class="flex flex-col sm:flex-row gap-y-2 sm:gap-x-3">
          <div class="sm:w-1/2 text-xl font-bold">Invoice ID:</div>
          <div class="sm:w-1/2 text-md">#{{ invoiceData?.id_checkout }}</div>
        </div>
        <div class="flex flex-col sm:flex-row gap-y-2 sm:gap-x-3">
          <div class="sm:w-1/2 text-xl font-bold">Nama:</div>
          <div class="sm:w-1/2 text-md">{{ invoiceData?.pelanggan?.nama }}</div>
        </div>
        <div class="flex flex-col sm:flex-row gap-y-2 sm:gap-x-3">
          <div class="sm:w-1/2 text-xl font-bold">Tanggal:</div>
          <div class="sm:w-1/2 text-md">{{ invoiceData?.tanggal }}</div>
        </div>
        <div class="flex flex-col sm:flex-row gap-y-2 sm:gap-x-3">
          <div class="sm:w-1/2 text-xl font-bold">Via:</div>
          <div class="sm:w-1/2 text-md">{{ invoiceData?.via }}</div>
        </div>
      </div>

      <div class="overflow-auto">
        <table class="w-full mt-4 text-sm border-t border-gray-300">
          <thead>
            <tr class="text-center border-b font-semibold">
              <th class="px-2 py-1">Barang</th>
              <th class="px-2 py-1">Qty</th>
              <th class="px-2 py-1">Harga Satuan</th>
              <th class="px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in invoiceData?.items || []" :key="index">
              <td class="text-center py-2">{{ item.nama_brg }}</td>
              <td class="text-center py-2">{{ item.qty }}</td>
              <td class="text-center py-2">Rp {{ item.harga_satuan.toLocaleString('id-ID') }}</td>
              <td class="text-center py-2">Rp {{ item.total.toLocaleString('id-ID') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col items-end gap-y-2 mt-4">
        <div class="flex justify-between gap-x-4 w-full sm:w-1/2">
          <h2 class="text-md font-semibold">Subtotal</h2>
          <h1 class="text-md">Rp {{ invoiceData?.subtotal?.toLocaleString('id-ID') }}</h1>
        </div>
        <div class="flex justify-between gap-x-4 w-full sm:w-1/2">
          <h2 class="text-md font-semibold">Ongkir</h2>
          <h1 class="text-md">Rp {{ invoiceData?.ongkir?.toLocaleString('id-ID') }}</h1>
        </div>
        <div class="flex justify-between gap-x-4 w-full sm:w-1/2">
          <h2 class="text-md font-semibold">Diskon</h2>
          <h1 class="text-md">Rp {{ invoiceData?.diskon?.toLocaleString('id-ID') }}</h1>
        </div>
        <div class="flex justify-between gap-x-4 w-full sm:w-1/2 border-t pt-2 mt-2">
          <h2 class="text-xl font-bold">Total Harga</h2>
          <h1 class="text-xl font-bold">Rp {{ invoiceData?.total_harga?.toLocaleString('id-ID') }}</h1>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-4">
        <router-link to="/User/Profile/Order" class="flex-1 text-center text-red-600 border border-red-600 hover:bg-red-600 hover:text-white py-2 px-4 rounded-md transition duration-200">
          Kembali
        </router-link>
        <button @click="downloadPDF" class="flex-1 text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
          Download Invoice PDF
        </button>
      </div>
    </div>
  </div>
</template>

