<script setup>
    import Navbar from '@/views/Dashboard/Navbar.vue'
    import Footer from '@/views/Dashboard/Footer.vue'
</script>

<template>
    <Navbar />
    <div class="pt-16">
        <div class="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
            <img src="@/assets/About1.jpg" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/40 flex justify-center items-center z-10 px-4">
                <div class="text-white text-center max-w-3xl md:max-w-4xl">
                    <div class="p-5">
                        <h1 class="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                            Teman Setia Kebutuhan Rumah Anda
                        </h1>
                    </div>
                    <div class="text-base md:text-xl mb-6 md:mb-8 leading-relaxed">
                        <p>
                            <b class="text-lg md:text-2xl font-bold">Indah Baru</b> adalah toko yang menyediakan berbagai alat-alat rumah tangga untuk kebutuhan sehari-hari Anda.
                            Mulai dari perlengkapan dapur, alat kebersihan, peralatan makan, hingga kebutuhan penyimpanan—semuanya kami sediakan dengan harga terjangkau dan kualitas yang terjamin.
                        </p>
                    </div>
                </div>
            </div>
        </div>


    <div class="w-full shadow-xl bg-white">
        <div class="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-8 px-6 py-12 md:py-20">
            <div class="w-full md:w-1/2">
                <h1 class="text-2xl md:text-5xl font-bold mb-4 text-center md:text-left">
                    Siapa Kami?
                </h1>
                <p class="text-base md:text-xl leading-relaxed md:text-left">
                    Berlokasi di <strong>Jln. Nusa Indah 2 No. 9</strong>, kami telah melayani pelanggan sejak tahun <strong>1978</strong>.<br>
                    Dengan pengalaman dan kepercayaan pelanggan yang terus tumbuh, <strong>CV. Indah Baru</strong> hadir sebagai solusi praktis
                    untuk memenuhi segala kebutuhan rumah tangga Anda.
                </p>
            </div>
            <div class="w-full md:w-1/2">
                <img src="@/assets/About2.jpg" alt="Tentang Kami" class="w-full h-auto rounded-lg shadow-md">
            </div>
        </div>
    </div>

    <div class="w-full md:py-5 py-10">
        <h1 class="text-3xl md:text-4xl xl:text-5xl font-bold text-center mb-4">Apa Yang Kami Tawarkan?</h1>
        <p class="text-center text-lg mb-8">Kami menjual berbagai produk seperti:</p>

        <div class="flex xl:grid xl:grid-cols-3 xl:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 gap-4">
            
            <div class="snap-start shrink-0 w-[80vw] sm:w-[60vw] lg:w-[40vw] xl:w-full xl:h-full xl:row-span-2 relative bg-[url(@/assets/Masak.jpg)] bg-cover bg-center rounded-xl overflow-hidden">
                <div class="absolute bottom-0 left-0 w-full bg-black/40 p-4 flex justify-center">
                    <span class="bg-white rounded-3xl px-4 py-2 font-bold text-center">Peralatan Dapur</span>
                </div>
            </div>

            <div class="snap-start shrink-0 w-[80vw] sm:w-[60vw] lg:w-[40vw] xl:w-full h-64 relative bg-[url(@/assets/Makan.jpg)] bg-cover bg-center rounded-xl overflow-hidden">
                <div class="absolute bottom-0 left-0 w-full bg-black/40 p-4 flex justify-center">
                    <span class="bg-white rounded-3xl px-4 py-2 font-bold text-center">Perlengkapan Makan & Minum</span>
                </div>
            </div>

            <div class="snap-start shrink-0 w-[80vw] sm:w-[60vw] lg:w-[40vw] xl:w-full h-64 relative bg-[url(@/assets/Tools.jpg)] bg-cover bg-center rounded-xl overflow-hidden">
                <div class="absolute bottom-0 left-0 w-full bg-black/40 p-4 flex justify-center">
                    <span class="bg-white rounded-3xl px-4 py-2 font-bold text-center">Alat Rumah Tangga</span>
                </div>
            </div>

            <div class="snap-start shrink-0 w-[80vw] sm:w-[60vw] lg:w-[40vw] xl:w-full h-64 relative bg-[url(@/assets/Storage.jpg)] bg-cover bg-center rounded-xl overflow-hidden">
                <div class="absolute bottom-0 left-0 w-full bg-black/40 p-4 flex justify-center">
                    <span class="bg-white rounded-3xl px-4 py-2 font-bold text-center">Penyimpanan & Organizer</span>
                </div>
            </div>

            <div class="snap-start shrink-0 w-[80vw] sm:w-[60vw] lg:w-[40vw] xl:w-full h-64 relative bg-[url(@/assets/Others.jpg)] bg-cover bg-center rounded-xl overflow-hidden">
                <div class="absolute bottom-0 left-0 w-full bg-black/40 p-4 flex justify-center">
                    <span class="bg-white rounded-3xl px-4 py-2 font-bold text-center">Dan Lainnya</span>
                </div>
            </div>
        </div>
    </div>

    <div class="w-full min-h-[60vh] md:h-screen px-4 py-10 md:py-20">
        <div class="relative h-full rounded-3xl overflow-hidden">
            <img src="@/assets/Footer.jpg" class="w-full h-full object-cover object-center rounded-3xl" />

            <div class="absolute inset-0 bg-black/40 flex justify-center items-center">
                <div class="text-white text-center md:text-left px-4 md:px-10 max-w-3xl">
                    <h1 class="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Komitmen Kami</h1>
                    <p class="text-sm sm:text-lg md:text-2xl leading-relaxed">
                        Kami selalu berusaha memberikan pelayanan terbaik dan produk yang bermanfaat untuk pelanggan.<br class="hidden sm:block">
                        Kepuasan dan kenyamanan Anda saat berbelanja adalah prioritas kami.
                    </p>
                </div>
            </div>
        </div>
    </div>
    <Footer />
    </div>
</template>
