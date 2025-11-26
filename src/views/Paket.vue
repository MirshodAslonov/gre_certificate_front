<template>
  <div
    class="relative min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center overflow-hidden p-6"
  >
    <!-- Orqa fon effekt -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        class="absolute top-[-15%] left-[-15%] w-[450px] h-[450px] bg-indigo-300 rounded-full blur-[150px] opacity-30 animate-pulse"
      ></div>
      <div
        class="absolute bottom-[-15%] right-[-15%] w-[450px] h-[450px] bg-pink-300 rounded-full blur-[150px] opacity-30 animate-pulse delay-1000"
      ></div>
    </div>

    <!-- Asosiy karta -->
  <div class="relative z-100 bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-8  max-w-[600px] text-center">

      <!-- Plastik karta rasmi -->
     <div class="relative mb-6 flex justify-center">
  <img
    src="/card1.png"
    alt="CARD"
    class="w-full max-w-[700px] mx-auto rounded-2xl"
  />
</div>
      
 <!-- To‘lov tizimlari -->
      <div class="flex justify-center space-x-6 mb-6">

        <div class="flex flex-col items-center">
          <button
            @click="openClick"
            class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <img src="/click1.png" alt="Click" class="w-8 h-8 rounded-xl" />
          </button>
          <span class="mt-1 text-xs text-gray-800">Click</span>
        </div>

        <div class="flex flex-col items-center">
          <button
            @click="openAlif"
            class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <img src="/alif.png" alt="Alif" class="w-8 h-8 rounded-xl" />
          </button>
          <span class="mt-1 text-xs text-gray-800">Alif</span>
        </div>

        <div class="flex flex-col items-center">
          <button
            @click="openXazna"
            class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <img src="/xazna.png" alt="Xazna" class="w-8 h-8 rounded-xl" />
          </button>
          <span class="mt-1 text-xs text-gray-800">Xazna</span>
        </div>

      </div>
      <!-- Paketlar -->
     <div class="grid grid-cols-1 gap-6 mb-8">
  <!-- 1-kunlik BEPUL -->
  <div>
    <div
      @click="openFree"
      class="cursor-pointer bg-gradient-to-br from-green-400 to-green-500 text-white rounded-2xl p-5 shadow-lg hover:scale-105 transition-transform relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-white/10 blur-xl opacity-30 animate-pulse"
      ></div>
      <h3 class="text-xl font-bold mb-1 relative z-10">1 kun</h3>
      <p class="text-lg font-semibold relative z-10">Bepul</p>
    </div>

    <!-- 1 kunlik Bepul xabar -->
    <div
      v-if="freeDayLink"
      class="bg-gradient-to-r from-green-50 to-green-100 border border-green-300 rounded-2xl p-4 mt-3 text-gray-800 shadow-inner"
    >
      🌿 <strong>Bepul sinov:</strong>
      <div v-if="freeDayLink.includes('http')">
        <a
          :href="freeDayLink"
          target="_blank"
          class="text-green-700 font-semibold underline"
          >Guruhga qo‘shilish</a
        >
      </div>
      <div v-else>
        {{ freeDayLink }}
      </div>
    </div>
  </div>

  <!-- 30 kunlik 90 000 so‘m -->
  <div>
    <div
      @click="selectPremium"
      class="cursor-pointer bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl p-5 shadow-lg hover:scale-105 transition-transform relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-white/10 blur-xl opacity-30 animate-pulse"
      ></div>
      <h3 class="text-xl font-bold mb-1 relative z-10">30 kun</h3>
      <p class="text-lg font-semibold relative z-10">90 ming</p>
    </div>

    <!-- Premium xabar -->
    <div
      v-if="selected === 'premium'"
      class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 mt-3 text-gray-700 shadow-inner"
    >
      💎 <strong>Bu paketni olish uchun</strong> — to‘lovni amalga oshiring va
      <span class="font-semibold text-indigo-600"
        >pastdagi Telegramga check yuboring.</span
      >
    </div>
  </div>
</div>

      <!-- Telegram tugmasi -->
      <a
        href="https://t.me/aslonov_official"
        target="_blank"
        class="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
      >
        Chekni yuborish
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </a>
    </div>

    <!-- Footer -->
    <footer
      class="relative z-10 mt-10 text-gray-500 text-sm opacity-0 animate-fadeIn delay-700"
    >
      © {{ new Date().getFullYear() }} Aslonov — Premium paket olish.
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/plugins/axios";

const selected = ref(null);
const freeDayLink = ref(null);
const token = ref(null)
const urlParams = new URLSearchParams(window.location.search)
  token.value = urlParams.get('token')

// 1 kunlik BEPUL paket
const openFree = async () => {
  freeDayLink.value = null;
  try {
    const { data } = await axios.get("/api/user/get/free/day/link", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    freeDayLink.value = data.free_day_link || data.message || "❌ Xatolik yuz berdi.";
  } catch (error) {
    console.error(error);
    freeDayLink.value = "❌ Ma’lumotlarni olishda xatolik yuz berdi.";
  }
};


// PREMIUM paket
const selectPremium = () => {
  selected.value = "premium";
};

// To‘lov tizimlari
const openXazna = () => {
  window.open(
    "https://pay.xazna.uz/p2p/d735952a-e5ec-4fd5-afca-0df26fa2e6aa",
    "_blank"
  );
};

const openClick = () => {
  window.open(
    "https://my.click.uz/clickp2p/AAACA4B98A7C9BFDFA3DDF2499DA7AEC20433A73A49288ABFD9AC4253D65AA49",
    "_blank"
  );
};

const openAlif = () => {
  window.open(
    "https://alif.go.link/toCard?cardId=uz_63zHxVHnM&adj_t=1qd6bic4",
    "_blank"
  );
};
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fadeIn {
  animation: fadeIn 1.5s ease-in forwards;
}
</style>
