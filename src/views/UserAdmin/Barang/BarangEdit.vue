<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const goBack = () => router.back()
const isSubmitting = ref(false)

const form = ref({
  id_brg: null,
  nm_brg: '',
  id_ktg: '',
  merk: '',
  stok: 0,
  satuan_brg: '',
  berat: 0,
  harga_brg: 0,
  diskon: 0,
  desk_brg: '',
  img: null
})

const kategoriList = ref([])

const getKategori = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/kategori')
    kategoriList.value = res.data
  } catch (err) {
    console.error('Gagal ambil kategori:', err)
  }
}

const getDetailBarang = async () => {
  try {
    const id = route.query.id_brg
    if (!id) return

    const res = await axios.get('http://localhost:8000/api/barang/show', {
      params: { id_brg: id }
    })

    const data = res.data
    form.value = {
      id_brg: data.id_brg,
      nm_brg: data.nm_brg,
      id_ktg: data.id_ktg,
      merk: data.merk,
      stok: data.stok,
      satuan_brg: data.satuan_brg,
      berat: data.berat,
      harga_brg: data.harga_brg,
      diskon: data.diskon,
      desk_brg: data.desk_brg,
      img: null
    }
  } catch (err) {
    console.error('Gagal ambil data barang:', err)
  }
}

const updateBarang = async () => {
  isSubmitting.value = true
  try {
    const formData = new FormData()
    for (let key in form.value) {
      if (key !== 'img') {
        formData.append(key, form.value[key])
      }
    }
    if (form.value.img) {
      formData.append('img', form.value.img)
    }

    await axios.post('http://localhost:8000/api/barang/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    router.push('/UserAdmin/Barang/Barang')
  } catch (err) {
    alert('Gagal update barang')
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  getKategori()
  getDetailBarang()
})
</script>

<template>
  <div class="w-full min-h-screen bg-[#000C] backdrop-blur-md flex justify-center items-start pt-10 px-4 pb-10 overflow-auto">
    <div class="w-full max-w-xl bg-white rounded-lg p-4 sm:p-6 shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-lg sm:text-2xl font-bold text-gray-800">Edit Data Barang</h1>
        <button @click="goBack" class="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium">
          ← Kembali
        </button>
      </div>

      <form @submit.prevent="updateBarang" class="flex flex-col gap-4 text-sm">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full">
            <label class="block font-medium text-gray-700">Nama Barang</label>
            <input v-model="form.nm_brg" type="text" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div class="w-full">
            <label class="block font-medium text-gray-700">Merk</label>
            <input v-model="form.merk" type="text" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full">
            <label class="block font-medium text-gray-700">Stok</label>
            <input v-model="form.stok" type="number" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div class="w-full">
            <label class="block font-medium text-gray-700">Satuan</label>
            <input v-model="form.satuan_brg" type="text" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full">
            <label class="block font-medium text-gray-700">Berat (kg)</label>
            <input v-model="form.berat" type="number" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div class="w-full">
            <label class="block font-medium text-gray-700">Diskon (%)</label>
            <input v-model="form.diskon" type="number" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        <div>
          <label class="block font-medium text-gray-700">Harga</label>
          <input v-model="form.harga_brg" type="number" class="mt-1 w-full border border-gray-300 rounded-md p-2" />
        </div>

        <div>
          <label class="block font-medium text-gray-700">Kategori</label>
          <select v-model="form.id_ktg" class="mt-1 w-full border border-gray-300 rounded-md p-2">
            <option disabled value="">-- Pilih Kategori --</option>
            <option v-for="kategori in kategoriList" :key="kategori.id_ktg" :value="kategori.id_ktg">
              {{ kategori.nm_ktg }}
            </option>
          </select>
        </div>

        <div>
          <label class="block font-medium text-gray-700">Gambar (opsional)</label>
          <input type="file" @change="e => form.img = e.target.files[0]" class="mt-1 w-full border border-gray-300 rounded-md p-2 file:bg-gray-100" />
        </div>

        <div>
          <label class="block font-medium text-gray-700">Deskripsi</label>
          <textarea v-model="form.desk_brg" rows="3" class="mt-1 w-full border border-gray-300 rounded-md p-2"></textarea>
        </div>

        <div class="pt-2">
          <button type="submit" :disabled="isSubmitting" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
            {{ isSubmitting ? 'Menyimpan...' : 'Update Barang' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
