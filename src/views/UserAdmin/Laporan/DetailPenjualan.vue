<script setup>
  import { useRouter } from 'vue-router'
  import { useRoute } from 'vue-router'
const route = useRoute()
const id = route.query.id
  import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
  const router = useRouter()
  const goBack = () => router.back()

  // Contoh data dummy – ganti dengan data asli dari backend nanti
  const ongkir = computed(() => Number(detailOrder.value?.checkout?.ongkir || 0))
const diskon = computed(() => Number(detailOrder.value?.checkout?.diskon || 0))
const total = computed(() => Number(detailOrder.value?.checkout?.ttl_harga || 0))



  const detailOrder = ref(null)

const fetchDetail = async () => {
  try {
    const res = await axios.get(`https://cvindahbaru.com/api/api/order/${id}`)
    detailOrder.value = res.data
  } catch (err) {
    console.error('Gagal mengambil detail order:', err)
  }
}
const subtotal = computed(() => {
  if (!detailOrder.value?.detailorder) return 0
  return detailOrder.value.detailorder.reduce((total, item) => {
    const harga = Number(item.barang?.harga_brg || 0)
    const qty = Number(item.dor_qty || 0)
    return total + harga * qty
  }, 0)
})

onMounted(() => {
  if (!id) {
    alert('ID tidak ditemukan di URL!')
    router.back()
    return
  }
  fetchDetail()
})

</script>

<template>
  <div class="w-screen min-h-screen overflow-auto">
    <div class="w-full min-h-screen flex justify-center items-center bg-[#000C] z-10 absolute top-0 left-0 backdrop-blur-md px-4">
      <div class="w-full sm:w-4/5 md:w-3/4 lg:w-1/2 bg-white py-6 px-5 flex flex-col items-center rounded-lg shadow-lg">
        <div class="w-full p-4 md:p-6 lg:p-10">

          <!-- Header & Tombol Kembali -->
          <div class="flex flex-col sm:flex-row justify-between items-start mb-6">
            <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 text-center md:text-left mb-4 sm:mb-0">Detail Barang Transaksi</h1>
            <button @click="goBack" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">← Kembali</button>
          </div>

          <!-- Tabel Barang -->
          <div class="overflow-x-auto rounded-lg shadow-md border border-gray-200 mb-6">
            <table class="min-w-full bg-white text-sm md:text-base text-left text-gray-700">
              <thead class="bg-indigo-600 text-white text-xs md:text-sm uppercase">
                <tr>
                  <th class="px-4 md:px-6 py-3">ID</th>
                  <th class="px-4 md:px-6 py-3">Nama Barang</th>
                  <th class="px-4 md:px-6 py-3">Qty</th>
                  <th class="px-4 md:px-6 py-3">Harga</th>
                  <th class="px-4 md:px-6 py-3">Total Harga</th>
                </tr>
              </thead>
              <tbody>
  <!-- Tampilkan jika ada data -->
  <tr
    v-for="(item, index) in detailOrder?.detailorder ?? []"
    :key="index"
    class="border-t hover:bg-gray-50"
  >
    <td class="px-4 md:px-6 py-3">{{ index + 1 }}</td>
    <td class="px-4 md:px-6 py-3">{{ item.barang?.nm_brg || '-' }}</td>
    <td class="px-4 md:px-6 py-3">{{ item.dor_qty }}</td>
    <td class="px-4 md:px-6 py-3">
      Rp {{ Number(item.barang?.harga_brg || 0).toLocaleString('id-ID') }}
    </td>
    <td class="px-4 md:px-6 py-3">
      Rp {{ (Number(item.barang?.harga_brg || 0) * item.dor_qty).toLocaleString('id-ID') }}
    </td>
  </tr>

  <!-- Tampilkan jika kosong -->
  <tr v-if="(detailOrder?.detailorder ?? []).length === 0">
    <td colspan="5" class="text-center text-gray-500 py-4">
      Tidak ada data detail order.
    </td>
  </tr>
</tbody>

            </table>
          </div>

          <!-- Informasi Ringkasan -->
          <div class="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm md:text-base space-y-2">
            
            <div class="flex justify-between text-gray-700">
              <span>Ongkir</span>
              <span>Rp {{ ongkir.toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Diskon</span>
              <span>- Rp {{ diskon.toLocaleString('id-ID') }}</span>
            </div>
            <hr class="my-2 border-gray-300" />
            <div class="flex justify-between font-semibold text-gray-900 text-lg">
              <span>Total</span>
              <span>Rp {{ total.toLocaleString('id-ID') }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
