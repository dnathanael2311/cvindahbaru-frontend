<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Navbar from '@/views/Dashboard/Navbar.vue'

const idPelanggan = localStorage.getItem('id_plg')
const keranjangItems = ref([])
const subtotal = ref(0)
const totalItem = ref(0)
const ongkir = ref(0)
const reward = ref(null)
const pelanggan = ref(null)

const fetchKeranjang = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/keranjang/get-by-pelanggan', {
      params: { id_plg: idPelanggan }
    })
    const id_krg = res.data.id_krg

    const isi = await axios.get('http://localhost:8000/api/isikeranjang/by-keranjang', {
      params: { id_krg }
    })

    keranjangItems.value = isi.data.map(item => ({
      ...item,
      id_krg,
      total: item.krg_qty * item.barang.harga_brg
    }))

    hitungSubtotal()
    await fetchOngkir()
  } catch (err) {
    console.error('Gagal ambil keranjang:', err)
  }
}

const fetchPelanggan = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/pelanggan/${idPelanggan}`)
    pelanggan.value = res.data
  } catch (err) {
    console.error('Gagal ambil data pelanggan:', err)
  }
}


const fetchReward = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/reward/latest', {
      params: { id_plg: idPelanggan }
    })
    reward.value = res.data
  } catch (err) {
    if (err.response?.status === 404) {
      reward.value = null
    } else {
      console.error('Gagal ambil reward:', err)
    }
  }
}

const updateQty = async (item, change) => {
  const newQty = item.krg_qty + change
  if (newQty < 1) return

  item.krg_qty = newQty
  item.total = newQty * item.barang.harga_brg
  hitungSubtotal()
  await fetchOngkir()

  try {
    await axios.post('http://localhost:8000/api/isikeranjang/update', {
      id_krg: item.id_krg,
      id_brg: item.id_brg,
      krg_qty: newQty
    })
  } catch (err) {
    console.error('Gagal update qty:', err)
  }
}

const hapusItem = async (item) => {
  if (!confirm(`Hapus ${item.barang.nm_brg} dari keranjang?`)) return
  try {
    await axios.post('http://localhost:8000/api/isikeranjang/delete', {
      id_krg: item.id_krg,
      id_brg: item.id_brg
    })
    keranjangItems.value = keranjangItems.value.filter(i => i.id_brg !== item.id_brg)
    hitungSubtotal()
    await fetchOngkir()
  } catch (err) {
    console.error('Gagal menghapus item:', err)
  }
}

const hitungSubtotal = () => {
  subtotal.value = keranjangItems.value.reduce((acc, item) => acc + item.total, 0)
  totalItem.value = keranjangItems.value.reduce((acc, item) => acc + item.krg_qty, 0)
}

const totalSebelumDiskon = computed(() => subtotal.value + ongkir.value)

const diskonReward = computed(() => {
  if (!reward.value || reward.value.jenis_rwd !== 'Total') return 0
  return Math.floor(totalSebelumDiskon.value * parseFloat(reward.value.value_rwd) / 100)
})

const totalSetelahDiskon = computed(() => {
  return totalSebelumDiskon.value - diskonReward.value
})

onMounted(() => {
  fetchKeranjang()
  fetchReward()
})
</script>



<template>
  <Navbar />

  <div class="w-full flex flex-col lg:flex-row">
    <div class="w-full lg:w-4/5 flex flex-col mt-16 p-4 md:p-8 lg:p-10">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-semibold">Keranjang</h1>
      <p class="text-sm md:text-base pt-2"><b>{{ totalItem }}</b> barang dalam keranjang Anda</p>

      <div class="w-full mt-6">
        <div class="bg-white rounded-lg shadow p-4 md:p-6 overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="text-left text-gray-500 uppercase text-xs md:text-sm border-b">
                <th class="px-2 md:px-4 py-2">Gambar</th>
                <th class="px-2 md:px-4 py-2">Nama Barang</th>
                <th class="px-2 md:px-4 py-2">Qty</th>
                <th class="px-2 md:px-4 py-2">Harga Satuan</th>
                <th class="px-2 md:px-4 py-2">Total Harga</th>
                <th class="px-2 md:px-4 py-2"></th>
              </tr>
            </thead>
            <tbody v-if="keranjangItems.length > 0" class="divide-y">
              <tr v-for="item in keranjangItems" :key="item.id_brg">
                <td class="px-2 md:px-4 py-4">
                  <img :src="`http://localhost:8000/storage/${item.barang.img}`" class="w-16 h-16 object-contain rounded-md" />
                </td>
                <td class="px-2 md:px-4 py-4">{{ item.barang.nm_brg }}</td>
                <td class="px-2 md:px-4 py-4">
                  <div class="inline-flex items-center border border-gray-300 rounded">
                    <button @click="updateQty(item, -1)" class="px-3 py-1 hover:bg-gray-100">−</button>
                    <span class="px-4">{{ item.krg_qty }}</span>
                    <button @click="updateQty(item, 1)" class="px-3 py-1 hover:bg-gray-100">+</button>
                  </div>
                </td>
                <td class="px-2 md:px-4 py-4 text-yellow-500 font-semibold">
                  Rp {{ item.barang.harga_brg.toLocaleString('id-ID') }}
                </td>
                <td class="px-2 md:px-4 py-4 text-gray-800 font-semibold">
                  Rp {{ item.total.toLocaleString('id-ID') }}
                </td>
                <td class="px-2 md:px-4 py-4">
                  <button @click="hapusItem(item)" class="text-red-600 hover:text-red-800 hover:underline text-sm">Hapus</button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center text-gray-500 py-6">Keranjang kosong.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Ringkasan -->
    <div class="w-full lg:w-1/5 p-4 md:p-6 lg:p-5 mt-6 lg:mt-16 lg:fixed lg:right-0 lg:top-1/2 lg:transform lg:-translate-y-1/2">
      <div class="bg-indigo-600 text-white p-4 md:p-5 rounded-xl">
        <div class="font-bold text-lg md:text-xl border-b border-white/40 pb-3">
          Total Isi Keranjang
        </div>

        <div class="flex justify-between pt-3 text-sm md:text-base">
          <span class="font-semibold">Subtotal</span>
          <span class="font-semibold text-right">Rp {{ subtotal.toLocaleString('id-ID') }}</span>
        </div>

        <div class="flex justify-between pt-2 text-sm md:text-base">
          <span class="font-semibold">Diskon</span>
          <span class="font-semibold text-right">Rp 0</span>
        </div>

        <hr class="border-white/40 my-2" />

        <div class="flex justify-between pt-2 text-base md:text-xl">
          <span class="font-bold">Total</span>
          <span class="font-bold text-right">
            <template v-if="reward?.jenis_rwd === 'Total'">
              <s class="text-red-300 block text-sm">Rp {{ totalSebelumDiskon.toLocaleString('id-ID') }}</s>
              Rp {{ totalSetelahDiskon.toLocaleString('id-ID') }}
            </template>
            <template v-else>
              Rp {{ totalSebelumDiskon.toLocaleString('id-ID') }}
            </template>
          </span>
        </div>

        <div class="w-full flex pt-4">
          <router-link
            :to="{
              path: '/User/Checkout',
              query: { item_value: subtotal }
            }"
            class="text-center bg-white text-indigo-600 rounded-lg px-3 py-2 w-full hover:bg-indigo-700 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Checkout
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
