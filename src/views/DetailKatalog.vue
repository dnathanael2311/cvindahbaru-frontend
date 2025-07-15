<!-- File: DetailKatalog.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const barang = ref(null)
const qty = ref(1)
const isLoading = ref(true)
const error = ref(null)
const message = ref('')

function increaseQty() {
  qty.value++
}
function decreaseQty() {
  if (qty.value > 1) qty.value--
}
function goBack() {
  router.back()
}

async function tambahKeKeranjang() {
  const idPelanggan = localStorage.getItem('id_plg')
  if (!idPelanggan) {
    message.value = 'Anda harus login terlebih dahulu.'
    setTimeout(() => {
      router.push('/User/UserLog/UserLog') // arahkan ke halaman login setelah 1.5 detik
    }, 1500)
    return
  }

  try {
    const res = await axios.post('https://cvindahbaru.com/api/api/isikeranjang/add', {
      id_plg: idPelanggan,
      id_brg: barang.value.id_brg,
      qty: qty.value
    })
    message.value = res.data.message || 'Berhasil menambahkan ke keranjang.'
  } catch (err) {
    console.error('Tambah ke keranjang gagal:', err)
    message.value = err.response?.data?.message || 'Gagal menambahkan ke keranjang.'
  }
}

onMounted(async () => {
  try {
    const id = route.params.id
    const res = await axios.get('https://cvindahbaru.com/api/api/barang/show', {
      params: { id_brg: id }
    })
    barang.value = res.data
  } catch (err) {
    error.value = 'Gagal memuat data barang.'
  } finally {
    isLoading.value = false
  }
})
</script>



<template>
  <div class="w-full min-h-screen flex flex-col md:flex-row bg-white">
    <!-- Gambar Barang -->
    <div class="w-full md:w-1/2 p-4 sm:p-6 flex justify-center items-center bg-gray-50">
      <img
        v-if="barang?.img"
        :src="`https://cvindahbaru.com/api/storage/${barang.img}`"
        alt="Produk"
        class="w-full max-w-[280px] sm:max-w-md max-h-[240px] sm:max-h-[400px] object-contain rounded-lg shadow-md"
      />
      <div v-else class="text-gray-400">Tidak ada gambar</div>
    </div>

    <!-- Informasi Barang -->
    <div class="w-full md:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-5">
      <button @click="goBack" class="flex items-center text-gray-600 hover:text-indigo-800 text-sm font-semibold">
        ← Kembali
      </button>

      <div v-if="isLoading">Memuat data barang...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <!-- Nama dan Kategori -->
        <div class="space-y-1">
          <div class="text-xs uppercase tracking-wide text-gray-500">
            {{ barang.kategori?.nm_ktg || 'Tanpa Kategori' }}
          </div>
          <div class="text-2xl font-bold text-gray-800">
            {{ barang.nm_brg }}
          </div>
        </div>

        <!-- Harga dan Diskon -->
        <div class="border-y py-2">
          <div class="text-xl font-bold text-slate-800">
            Rp {{ Number(barang.harga_brg).toLocaleString('id-ID') }}
            <span v-if="barang.diskon > 0" class="text-sm text-red-600 ml-2">
              (Diskon {{ barang.diskon }}%)
            </span>
          </div>
        </div>

        <!-- Detail Tambahan -->
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div><strong>Merk:</strong> {{ barang.merk }}</div>
          <div><strong>Satuan:</strong> {{ barang.satuan_brg }}</div>
          <div><strong>Berat:</strong> {{ barang.berat }} gram</div>
          <div><strong>Stok:</strong> {{ barang.stok }}</div>
        </div>

        <!-- Deskripsi -->
        <div>
          <div class="text-sm font-semibold text-gray-500 mb-1">Deskripsi</div>
          <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {{ barang.desk_brg }}
          </p>
        </div>

        <!-- Jumlah -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600 font-medium">Qty:</span>
          <div class="flex items-center border border-gray-300 rounded overflow-hidden">
            <button @click="decreaseQty" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg">−</button>
            <span class="px-4 text-base font-medium w-8 text-center select-none">{{ qty }}</span>
            <button @click="increaseQty" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg">+</button>
          </div>
        </div>

        <!-- Tambahkan ke Keranjang -->
        <div class="pt-4">
          <button
            @click="tambahKeKeranjang"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Tambahkan ke Keranjang
          </button>
        </div>

        <!-- Pesan -->
        <div v-if="message" class="mt-2 text-sm font-medium text-green-600">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>
