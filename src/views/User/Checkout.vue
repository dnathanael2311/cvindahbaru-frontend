<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const itemValue = ref(Number(route.query.item_value || 0))
const router = useRouter()
const step = ref(1)

const pelanggan = ref({
  nm_plg: '',
  no_plg: '',
  email_plg: '',
  alamat: '',
  provinsi_nama: '',
  kota_nama: ''
})

const selectedKurir = ref('')
const estimasi = ref('')
const isiKeranjang = ref([])
const subtotal = ref(0)
const diskon = ref(0)
const ongkir = ref(0)
const total = ref(0)

const reward = ref(null)
const diskonOngkir = ref(0)
const ongkirAsli = ref(0)

const nextStep = () => step.value = 2
const prevStep = () => step.value = 1
const goBack = () => router.back()

onMounted(async () => {
  const id_plg = localStorage.getItem('id_plg')
  if (!id_plg) return

  try {
    const res = await axios.get(`http://localhost:8000/api/pelanggan/${id_plg}`)
    const data = res.data

    pelanggan.value = {
      nm_plg: data.nm_plg,
      no_plg: data.no_plg,
      email_plg: data.email_plg,
      alamat: data.alamat,
      provinsi_nama: '',
      kota_nama: ''
    }

    await axios.get(`http://localhost:8000/api/rajaongkir/provinces`).then((provRes) => {
      let prov = provRes.data.data.find(p => p.id == parseInt(data.provinsi))
      pelanggan.value.provinsi_nama = prov.name
    })

    await axios.get(`http://localhost:8000/api/rajaongkir/cities/${data.provinsi}`).then((kotaRes) => {
      let kota = kotaRes.data.data.find(k => k.id == parseInt(data.kota))
      pelanggan.value.kota_nama = kota.name
    })

    const keranjangRes = await axios.get(`http://localhost:8000/api/isikeranjang/isi_keranjang?id_plg=${id_plg}`)
    const barang = keranjangRes.data

    isiKeranjang.value = barang.map(item => ({
      id_brg: item.id_brg,
      nama_brg: item.barang?.nama_brg ?? 'Barang',
      gambar: item.barang?.gambar ?? 'default.jpg',
      qty: item.krg_qty,
      harga_satuan: item.barang?.harga ?? 0,
      total: item.krg_qty * (item.barang?.harga ?? 0)
    }))

    subtotal.value = isiKeranjang.value.reduce((sum, item) => sum + item.total, 0)

    // Ambil reward
    const rewardRes = await axios.get(`http://localhost:8000/api/reward/latest`, {
      params: { id_plg }
    })
    console.log(rewardRes)
    reward.value = rewardRes.data

    if (reward.value?.jenis_rwd === 'Total') {
      diskon.value = Math.floor(subtotal.value * (parseFloat(reward.value.value_rwd) / 100))
    }

    total.value = subtotal.value + ongkir.value - diskon.value
  } catch (err) {
    console.error('Gagal ambil data pelanggan:', err)
    alert('Gagal ambil data pelanggan!')
  }
})

const cekOngkir = async () => {
  if (!selectedKurir.value) return alert("Pilih kurir terlebih dahulu.")

  try {
    const id_plg = localStorage.getItem('id_plg')
    const resPelanggan = await axios.get(`http://localhost:8000/api/pelanggan/${id_plg}`)
    const data = resPelanggan.data

    const barangUtama = isiKeranjang.value[0]
    if (!barangUtama) return alert("Isi keranjang kosong.")

    const response = await axios.get('http://localhost:8000/api/rajaongkir/cost', {
      params: {
        origin: 512,
        destination: data.kota,
        weight: 1,
        courier: selectedKurir.value,
        id_brg: barangUtama.id_brg,
        id_plg: id_plg,
        item_value: itemValue.value
      }
    })

    // Ambil dari calculate_reguler
    const layanan = response.data?.data?.calculate_reguler?.find(
      service => service.shipping_name?.toLowerCase() === selectedKurir.value.toLowerCase()
    )

    if (!layanan) {
      estimasi.value = 'Estimasi tidak tersedia'
      ongkir.value = 0
      return
    }

    const tarif = layanan.shipping_cost_net ?? 0
    const estimasi_hari = layanan.etd ?? ''

    estimasi.value = estimasi_hari && estimasi_hari !== '0' ? `${estimasi_hari}` : 'Estimasi tidak tersedia'
    ongkirAsli.value = tarif

    if (reward.value?.jenis_rwd === 'Ongkir') {
      diskonOngkir.value = Math.floor(tarif * parseFloat(reward.value.value_rwd) / 100)
    }

    ongkir.value = tarif - diskonOngkir.value
    total.value = subtotal.value + ongkir.value - diskon.value
  } catch (err) {
    console.error('❌ Error cek ongkir:', err)
    alert('Gagal menghitung ongkir. Coba lagi.')
  }
}


const bayarSekarang = async () => {
  const id_plg = localStorage.getItem('id_plg')

  try {
    const response = await axios.post('http://localhost:8000/api/payment/midtrans/token', {
      total: total.value,
      nama: pelanggan.value.nm_plg,
      email: pelanggan.value.email_plg,
      no_hp: pelanggan.value.no_plg,
    })

    const token = response.data.token

    window.snap.pay(token, {
      onSuccess: function (result) {
        console.log("Sukses bayar", result)
        router.push('/User/Invoice')
      },
      onPending: function (result) {
        console.log("Pending", result)
        router.push('/User/Invoice')
      },
      onError: function (result) {
        alert("Pembayaran gagal")
        console.error(result)
      },
      onClose: function () {
        alert("Kamu menutup popup sebelum menyelesaikan pembayaran")
      }
    })
  } catch (error) {
    console.error('Gagal memproses pembayaran:', error)
    alert('Gagal memproses pembayaran!')
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-[#000C] backdrop-blur-md py-10 px-4 flex justify-center items-start overflow-y-auto">
    <div v-if="step === 1" class="w-full max-w-4xl bg-white rounded-lg px-6 py-6 flex flex-col items-center">
      <div class="w-full font-bold text-2xl pb-4 border-b border-gray-300">Konfirmasi Pembelian</div>

      <button @click="goBack" class="mb-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium self-start">← Kembali</button>

      <div class="w-full font-bold text-xl py-4 border-b border-gray-300">Informasi Pelanggan</div>
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base p-2">
        <div>Nama:</div><div>{{ pelanggan.nm_plg }}</div>
        <div>No. Telepon:</div><div>{{ pelanggan.no_plg }}</div>
        <div>Email:</div><div>{{ pelanggan.email_plg }}</div>
        <div>Alamat:</div><div>{{ pelanggan.alamat }}</div>
        <div>Provinsi:</div><div>{{ pelanggan.provinsi_nama }}</div>
        <div>Kota:</div><div>{{ pelanggan.kota_nama }}</div>
      </div>

      <div class="w-full font-bold text-xl pt-6 pb-2 border-b border-gray-300">Pilih Kurir</div>
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base p-2">
        <div>
          <label class="font-medium mb-1 block">Kurir</label>
          <select v-model="selectedKurir" @change="cekOngkir" class="w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">-- Pilih Kurir --</option>
            <option value="jne">JNE</option>
            <option value="pos">POS Indonesia</option>
            <option value="tiki">TIKI</option>
          </select>
        </div>
        <div v-if="estimasi">
          <label class="font-medium mb-1 block">Estimasi Pengiriman</label>
          <div class="p-2 border rounded-md bg-gray-100 text-gray-700">{{ estimasi }}</div>
        </div>
      </div>

      <div class="w-full mt-6">
        <button @click="nextStep" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition">
          Selanjutnya
        </button>
      </div>
    </div>

    <div v-if="step === 2" class="w-full max-w-4xl bg-white rounded-lg px-6 py-6 flex flex-col items-center">
      <div class="w-full font-bold text-2xl pb-4 border-b border-gray-300">Ringkasan Belanja</div>

      <div class="w-full py-5 px-2">
        <div class="bg-white rounded-lg shadow p-4 overflow-auto max-h-[400px]">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 uppercase border-b">
                <th class="px-4 py-2">Gambar</th>
                <th class="px-4 py-2">Barang</th>
                <th class="px-4 py-2">Qty</th>
                <th class="px-4 py-2">Harga</th>
                <th class="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody v-if="isiKeranjang.length > 0" class="divide-y">
              <tr v-for="(item, i) in isiKeranjang" :key="i" class="hover:bg-gray-50">
                <td class="px-4 py-4">
                  <img :src="`http://localhost:8000/storage/${item.gambar}`" class="w-14 h-14 object-cover rounded" />
                </td>
                <td class="px-4 py-4">{{ item.nama_brg }}</td>
                <td class="px-4 py-4">{{ item.qty }}</td>
                <td class="px-4 py-4">Rp {{ item.harga_satuan.toLocaleString('id-ID') }}</td>
                <td class="px-4 py-4">Rp {{ item.total.toLocaleString('id-ID') }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr><td colspan="5" class="text-center py-6 text-gray-400">Keranjang Anda kosong</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-md p-2">
        <div>Subtotal:</div><div>Rp {{ subtotal.toLocaleString('id-ID') }}</div>
        <div>Diskon:</div><div>Rp {{ diskon.toLocaleString('id-ID') }}</div>
        <div>Ongkir:</div><div>Rp {{ ongkir.toLocaleString('id-ID') }}</div>
        <div class="text-lg font-bold">Total:</div>
        <div class="text-lg font-bold">Rp {{ total.toLocaleString('id-ID') }}</div>
      </div>

      <div class="w-full flex flex-col sm:flex-row gap-3 mt-4 font-bold text-md">
        <button @click="prevStep" class="w-full sm:w-1/2 text-red-600 border border-red-600 hover:bg-red-600 hover:text-white py-2 rounded-md transition">
          Kembali
        </button>   
        <button @click="bayarSekarang" class="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition">
          Konfirmasi & Bayar
        </button>
      </div>
    </div>
  </div>
</template>
