<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center overflow-hidden">
    
    <!-- Orqa fon effekti -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-300 rounded-full blur-[120px] opacity-30 animate-pulse delay-1000"></div>
    </div>

    <!-- Profil card -->
    <div
      class="relative z-10 bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center transition-all duration-700 animate-fadeInUp"
    >
      <h1 class="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
        👋 Xush kelibsiz,
        <span class="text-indigo-600">{{ userName || 'mehmon' }}</span>!
      </h1>

      <p class="text-gray-600 mb-8 text-sm font-medium">Siz uchun maxsus testlar tayyor.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          @click="goToProfile"
          class="py-3 rounded-xl border border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
        >
          👤 Profil
        </button>

        <button
          @click="goToGreTest"
          class="py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-indigo-400/50 hover:scale-105 transition-all duration-300"
        >
          🎓 GRE TEST
        </button>

        <button
          @click="goToAiTest"
          class="py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-pink-400/50 hover:scale-105 transition-all duration-300"
        >
          🧠 AI TEST
        </button>

        <button
          @click="goToPaket"
          class="py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold shadow-md hover:shadow-amber-400/50 hover:scale-105 transition-all duration-300"
        >
          💎 PAKET
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="relative z-10 mt-10 text-gray-500 text-sm opacity-0 animate-fadeIn delay-700">
      © {{ new Date().getFullYear() }} Aslonov — Barcha huquqlar himoyalangan.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('')
const token = ref(null)

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  token.value = urlParams.get('token')

  try {
    const { data } = await axios.get('/api/user/auth/get', {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    if (!data.first_name) {
      router.push({ name: 'register', query: { token: token.value } })
      return
    }

    userName.value = `${data.first_name} ${data.last_name ?? ''}`.trim()
  } catch {
    router.push({ name: 'register', query: { token: token.value } })
  }
})

const goToProfile = () => {
  router.push({ name: 'profile', query: { token: token.value } })
}

const goToGreTest = () => {
  router.push({ name: 'gre-test', query: { token: token.value } })
}

const goToAiTest = () => {
  router.push({ name: 'ai-test', query: { token: token.value } })
}

const goToPaket = () => {
  router.push({ name: 'paket', query: { token: token.value } })
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
