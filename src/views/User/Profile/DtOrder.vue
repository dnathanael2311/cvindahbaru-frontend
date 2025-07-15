<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id

const order = ref(null)

const fetchOrder = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/order/${orderId}`)
    order.value = response.data
  } catch (error) {
    console.error('Gagal mengambil data detail order:', error)
  }
}

const subtotal = computed(() => {
  if (!order.value?.detailorder) return 0
  return order.value.detailorder.reduce((total, item) => {
    const harga = Number(item.barang?.harga_brg || 0)
    const qty = Number(item.dor_qty || 0)
    return total + harga * qty
  }, 0)
})

const diskon = computed(() => Number(order.value?.checkout?.diskon || 0))
const ongkir = computed(() => Number(order.value?.checkout?.ongkir || 0))

const totalAkhir = computed(() => {
  return subtotal.value - diskon.value + ongkir.value
})

const goBack = () => router.back()
const downloadPDF = () => {
  const original = document.getElementById("invoiceContent")
  if (!original) {
    alert("Konten invoice tidak ditemukan")
    return
  }

  // Clone node supaya tidak terkena style `overflow`, `max-height`, dll
  const clone = original.cloneNode(true)
  clone.style.maxHeight = "none"
  clone.style.overflow = "visible"
  clone.style.height = "auto"
  clone.style.position = "absolute"
  clone.style.left = "-9999px"
  document.body.appendChild(clone)

  const opt = {
    margin: 0.5,
    filename: `invoice-${orderId}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  }

  window.html2pdf().set(opt).from(clone).save().then(() => {
    document.body.removeChild(clone) // bersihkan setelah selesai
  })
}



onMounted(() => {
  fetchOrder()
})
</script>


<template>
  <div class="w-screen h-screen overflow-hidden">
    <div class="w-full h-screen flex justify-center items-center bg-[#000C] z-10 absolute top-0 left-0 backdrop-blur-md">
      <div class="w-full sm:w-[90%] md:w-3/4 lg:w-1/2 flex flex-col items-center">
        
        <!-- Konten yang akan di-export ke PDF -->
        <div id="invoiceContent" class="bg-white py-6 px-5 rounded-lg p-4 md:p-10 max-h-[90vh] overflow-auto w-full">
          <div class="w-full flex font-bold text-2xl pb-4 border-b border-gray-300">
            <button @click="goBack" class="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium">
              ← Kembali
            </button>
            <h1>Detail Order</h1>
          </div>

          <div class="w-full py-5 px-2">
            <div class="bg-white rounded-lg shadow p-4 md:p-6 max-h-[400px] overflow-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="text-left text-gray-500 uppercase border-b text-xs">
                    <th class="px-2 py-2">Gambar</th>
                    <th class="px-2 py-2">Nama Barang</th>
                    <th class="px-2 py-2">Qty</th>
                    <th class="px-2 py-2">Harga Satuan</th>
                    <th class="px-2 py-2">Total Harga</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr v-for="(item, index) in order?.detailorder ?? []" :key="index" class="hover:bg-gray-50">
                    <td class="px-2 py-4">
                      <img :src="`http://localhost:8000/storage/${item.barang?.img}`" alt="Gambar Barang" class="w-12 h-12 object-cover rounded">
                    </td>
                    <td class="px-2 py-4 font-semibold text-yellow-500 text-base">
                      {{ item.barang?.nm_brg ?? '-' }}
                    </td>
                    <td class="px-2 py-4">{{ item.dor_qty }}</td>
                    <td class="px-2 py-4">
                      Rp {{ Number(item.barang?.harga_brg).toLocaleString('id-ID') }}
                    </td>
                    <td class="px-2 py-4">
                      Rp {{ (Number(item.barang?.harga_brg) * item.dor_qty).toLocaleString('id-ID') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="w-full flex flex-col md:flex-row text-sm gap-2 md:gap-x-4 p-2">
            <div class="w-full md:w-1/2 font-medium text-gray-700">Diskon :</div>
            <div class="w-full md:w-1/2 font-medium text-gray-700">Rp {{ order?.checkout?.diskon?.toLocaleString('id-ID') ?? 0 }}</div>
          </div>

          <div class="w-full flex flex-col md:flex-row text-sm gap-2 md:gap-x-4 p-2">
            <div class="w-full md:w-1/2 font-medium text-gray-700">Ongkir :</div>
            <div class="w-full md:w-1/2 font-medium text-gray-700">Rp {{ order?.checkout?.ongkir?.toLocaleString('id-ID') ?? '0' }}</div>
          </div>

          <div class="w-full flex flex-col md:flex-row text-xl gap-2 md:gap-x-4 p-2 font-bold">
            <div class="w-full md:w-1/2 text-gray-700">Total :</div>
            <div class="w-full md:w-1/2 text-gray-700">Rp {{ totalAkhir.toLocaleString('id-ID') }}</div>
          </div>

          <div class="w-full font-bold text-xl py-4 border-b border-gray-300">Informasi Pelanggan</div>
          <div class="w-full space-y-2">
            <div class="flex flex-col md:flex-row gap-2 md:gap-x-4">
              <div class="w-full md:w-1/2 font-medium text-sm text-gray-700">Nama Pelanggan :</div>
              <p class="w-full md:w-1/2 text-sm text-gray-700">{{ order?.pelanggan?.nm_plg ?? '-' }}</p>
            </div>
            <div class="flex flex-col md:flex-row gap-2 md:gap-x-4">
              <div class="w-full md:w-1/2 font-medium text-sm text-gray-700">Nomor Telepon :</div>
              <p class="w-full md:w-1/2 text-sm text-gray-700">{{ order?.pelanggan?.no_plg ?? '-' }}</p>
            </div>
            <div class="flex flex-col md:flex-row gap-2 md:gap-x-4">
              <div class="w-full md:w-1/2 font-medium text-sm text-gray-700">Email :</div>
              <p class="w-full md:w-1/2 text-sm text-gray-700">{{ order?.pelanggan?.email_plg ?? '-' }}</p>
            </div>
            <div class="flex flex-col md:flex-row gap-2 md:gap-x-4">
              <div class="w-full md:w-1/2 font-medium text-sm text-gray-700">Alamat :</div>
              <p class="w-full md:w-1/2 text-sm text-gray-700">{{ order?.pelanggan?.alamat ?? '-' }}</p>
            </div>
          </div>

          <div class="w-full font-bold text-xl py-4 border-b border-gray-300">Alamat Pelanggan</div>
          <div class="w-full space-y-2">
            <div class="flex flex-col md:flex-row gap-2 md:gap-x-4">
              <div class="w-full md:w-1/2 font-medium text-sm text-gray-700">Kota :</div>
              <p class="w-full md:w-1/2 text-sm text-gray-700">{{ order?.pelanggan?.kota ?? '-' }}</p>
            </div>
            <div class="flex flex-col md:flex-row gap-2 md:gap-x-4">
              <div class="w-full md:w-1/2 font-medium text-sm text-gray-700">Provinsi :</div>
              <p class="w-full md:w-1/2 text-sm text-gray-700">{{ order?.pelanggan?.provinsi ?? '-' }}</p>
            </div>
            <div class="flex flex-col md:flex-row gap-2 md:gap-x-4">
              <div class="w-full md:w-1/2 font-medium text-sm text-gray-700">Service :</div>
              <p class="w-full md:w-1/2 text-sm text-gray-700">{{ order?.checkout?.kurir ?? '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Tombol berada DI LUAR elemen invoiceContent -->
        <!-- Tombol DI LUAR invoiceContent -->
<button
  @click="downloadPDF"
  class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 z-50 relative"
>
  Download Invoice PDF
</button>

      </div>
    </div>
  </div>
</template>
