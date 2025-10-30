<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center overflow-hidden p-6">

    <!-- Orqa fon effekt -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-15%] left-[-15%] w-[450px] h-[450px] bg-indigo-300 rounded-full blur-[150px] opacity-30 animate-pulse"></div>
      <div class="absolute bottom-[-15%] right-[-15%] w-[450px] h-[450px] bg-pink-300 rounded-full blur-[150px] opacity-30 animate-pulse delay-1000"></div>
    </div>

    <!-- Asosiy karta -->
    <div
      class="relative z-50 bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center transition-all duration-700 animate-fadeInUp"
    >
      <!-- Plastik karta rasmi -->
      <div class="relative mb-6">
        <img
            src="/card.png"
            alt="CARD"
            class="mx-auto w-100 h-auto drop-shadow-xl rounded-2xl"
        />
    </div>

     <div class="flex justify-center space-x-6 mb-6">
      <!-- Click icon -->
  <div class="flex flex-col items-center">
    <button
      @click="openClick"
      class="w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
    >
      <img 
        src="/click1.png" 
        alt="Click" 
        class="w-8 h-8 rounded-xl"
      />
    </button>
    <span class="mt-1 text-xs text-gray-800">Click</span>
  </div>

<!-- Alif icon -->
  <div class="flex flex-col items-center">
    <button
      @click="openAlif"
      class="w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
    >
      <img 
        src="/alif.png" 
        alt="Alif" 
        class="w-8 h-8 rounded-xl"
      />
    </button>
    <span class="mt-1 text-xs text-gray-800">Alif</span>
  </div>

  <!-- Xazna icon -->
  <div class="flex flex-col items-center">
    <button
      @click="openXazna"
      class="w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
    >
      <img 
        src="/xazna.png" 
        alt="Xazna" 
        class="w-8 h-8 rounded-xl"
      />
    </button>
    <span class="mt-1 text-xs text-gray-800">Xazna</span>
  </div>

</div> 

    <h3 class="text-lg font-semibold mb-2">Check yuborish uchun</h3>
    

    <!-- Telegramga kirish button -->
    <a
      href="https://t.me/aslonov_official"
      target="_blank"
      class="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
    >
      Telegramga kirish
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
      </svg>
    </a>
</div>

    <!-- Footer -->
    <footer class="relative z-10 mt-10 text-gray-500 text-sm opacity-0 animate-fadeIn delay-700">
      © {{ new Date().getFullYear() }} Aslonov — Premium paket olish.
    </footer>
  </div>


</template>

<script setup>
import { ref } from 'vue'

const cardNumber = ref('9860180101797041')


// Xazna havolasi (o‘zing haqiqiy linkni qo‘y)
const openXazna = () => {
  window.open('https://pay.xazna.uz/p2p/9e8428ef-7e86-4905-9edf-60eb61810cb4', '_blank')
}

const openAlif = () => {
  window.open('https://alif.go.link/toCard?cardId=uz_MgpIClTrp&adj_t=1qd6bic4', '_blank')
}

const openClick = () => {
  window.open('https://my.click.uz/clickp2p/D760B448F76359A64D4A92E022C945369D039A939DD860A8970718A8CFDA6ED0', '_blank')
}

</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
.animate-fadeIn {
  animation: fadeIn 1.5s ease-in forwards;
}
</style>
