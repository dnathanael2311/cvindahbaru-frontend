<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()

const form = ref({
  nm_brg: '',
  id_ktg: '',
  merk: '',
  stok: 0,
  satuan_brg: '',
  berat: 0,
  diskon: 0,
  harga_brg: 0,
  desk_brg: '',
  img: null
})

const kategoriList = ref([])

const getKategori = async () => {
  try {
    const res = await axios.get('https://cvindahbaru.com/api/api/kategori')
    kategoriList.value = res.data
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
}

onMounted(() => {
  getKategori()
})

const submitForm = async () => {
  try {
    const formData = new FormData()

    // Append semua field kecuali 'img'
    for (let key in form.value) {
      if (key !== 'img') {
        formData.append(key, form.value[key])
      }
    }

    // Tambahkan file jika ada
    if (form.value.img) {
      formData.append('img', form.value.img)
    }

    await axios.post('https://cvindahbaru.com/api/api/barang/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('Barang berhasil ditambahkan')
    router.back()
  } catch (err) {
    console.error('Gagal menambahkan barang:', err.response?.data || err)
    alert('Gagal menambahkan barang')
  }
}

</script>

<template>
  <div class="w-full min-h-screen bg-[#000C] backdrop-blur-md flex justify-center items-center px-3 py-6">
    <div class="w-full max-w-3xl bg-white rounded-lg p-4 sm:p-6 shadow-lg">
      <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
        <h1 class="text-lg sm:text-2xl font-bold text-gray-800">Tambah Barang</h1>
        <button @click="goBack" class="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium">
          ← Kembali
        </button>
      </div>

      <form class="space-y-4 text-sm sm:text-base" @submit.prevent="submitForm">
        <div>
          <label class="block text-gray-700 font-medium">Nama Barang</label>
          <input v-model="form.nm_brg" type="text" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
        </div>

        <div>
          <label class="block text-gray-700 font-medium">Kategori</label>
          <select v-model="form.id_ktg" class="mt-1 w-full border border-gray-300 rounded-md p-2">
            <option disabled value="">-- Pilih Kategori --</option>
            <option v-for="kategori in kategoriList" :key="kategori.id_ktg" :value="kategori.id_ktg">
              {{ kategori.nm_ktg }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-medium">Gambar (opsional)</label>
          <input type="file" @change="e => form.img = e.target.files[0]" class="mt-1 w-full border border-gray-300 rounded-md p-2 file:bg-gray-100 hover:file:bg-gray-200" />
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full">
            <label class="block text-gray-700 font-medium">Merk</label>
            <input v-model="form.merk" type="text" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div class="w-full">
            <label class="block text-gray-700 font-medium">Qty</label>
            <input v-model="form.stok" type="number" min="0" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full">
            <label class="block text-gray-700 font-medium">Satuan</label>
            <input v-model="form.satuan_brg" type="text" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div class="w-full">
            <label class="block text-gray-700 font-medium">Berat (kg)</label>
            <input v-model="form.berat" type="number" min="0" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full">
            <label class="block text-gray-700 font-medium">Harga</label>
            <input v-model="form.harga_brg" type="number" min="0" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div class="w-full">
            <label class="block text-gray-700 font-medium">Diskon (%)</label>
            <input v-model="form.diskon" type="number" min="0" max="100" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-medium">Deskripsi</label>
          <textarea v-model="form.desk_brg" rows="3" class="mt-1 w-full border border-gray-300 rounded-md p-2"></textarea>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold">
            Tambah Barang
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
