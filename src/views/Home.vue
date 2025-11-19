<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center overflow-hidden">
    <!-- Orqa fon effekti -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-300 rounded-full blur-[120px] opacity-30 animate-pulse delay-1000"></div>
    </div>

    <!-- Profil card -->
    <div class="relative z-10 bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center transition-all duration-700 animate-fadeInUp">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
        👋 Xush kelibsiz,
        <span class="text-indigo-600">{{ userName || 'mehmon' }}</span>!
      </h1>

      <!-- <p class="text-gray-600 mb-8 text-sm font-medium">Siz uchun maxsus testlar tayyor.</p> -->

      <!-- Obuna statusi -->
      <div v-if="subscription" class="mb-6 text-left bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 shadow-inner">
        <h2 class="text-lg font-semibold text-gray-800 mb-1">
          {{ isFreeSubscription ? '🆓 Bepul obuna' : '💎 Premium obuna' }}
        </h2>

        <p class="text-gray-600 text-sm mb-2">
          Boshlangan sana: <span class="font-medium">{{ formatDate(subscription.started_at) }}</span><br>
          Tugash sana: <span class="font-medium">{{ formatDate(subscription.expires_at) }}</span>
        </p>

        <div class="flex items-center justify-between" v-if="!isFreeSubscription">
          <p class="text-sm font-semibold text-gray-700">Qolgan vaqt:</p>
          <span :class="getColorClass(remainingDays)" class="text-lg font-bold px-3 py-1 rounded-xl">
            {{ remainingDays  + 1}} kun
          </span>
        </div>
      </div>

      <div v-else class="mb-6 text-gray-600 italic">
        🚫 Sizda hozircha faol obuna yo‘q.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <!-- Profil -->
  <button
    @click="goToProfile"
    class="py-3 rounded-[1.5rem] border border-indigo-400 text-indigo-600 font-semibold 
           bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-[1.03] 
           transition-all duration-300"
  >
    👤 Profil
  </button>

  
 <!-- <button
 @click="goToGreTest"
  class="relative px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow-lg 
         rounded-[2rem_0.5rem_2rem_0.5rem] hover:scale-105 hover:shadow-2xl transition-all duration-300">
  🎓 GRE TEST
</button>

  
  <button
    @click="goToAiTest"
    class="py-3 rounded-[2rem_0.5rem_2rem_0.5rem] bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 
           text-white font-semibold shadow-lg hover:shadow-pink-400/50 hover:scale-[1.05]   text-lg
           transition-all duration-300"
  >
    🧠 AI TEST
  </button> -->

  <!-- Paket -->
  <button
    @click="goToPaket"
    class="py-3 rounded-[2rem_0.5rem_2rem_0.5rem] bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 
           text-white font-semibold shadow-lg hover:shadow-amber-400/50 hover:scale-[1.05]  text-lg
           transition-all duration-300"
  >
    💎 PAKET
  </button>

  <!-- Admin Panel (faqat admin uchun) -->
  <button
    v-if="Number(telegram_id) === 7989008099"
    @click="goToAdminPanel"
    class="py-3 px-6 rounded-[1.5rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
           text-white font-semibold shadow-xl hover:shadow-purple-400/50 hover:scale-[1.05] 
           hover:brightness-110 transition-all duration-300"
  >
    ADMIN PANEL
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
import { ref, onMounted, computed } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()
const userName = ref('')
const telegram_id = ref(null)
const token = ref(null)
const subscription = ref(null)
const remainingDays = ref(0)

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
    telegram_id.value = data.telegram_id
    if (data.active_subscription) {
      subscription.value = data.active_subscription

      const now = dayjs()
      const expires = dayjs(subscription.value.expires_at)
      const diff = expires.diff(now, 'day')
      remainingDays.value = diff > 0 ? diff : 0
    }
  } catch {
    router.push({ name: 'register', query: { token: token.value } })
  }
})

// 👉 Bepul yoki Premium obunani aniqlovchi computed property
const isFreeSubscription = computed(() => {
  if (!subscription.value) return false
  const start = dayjs(subscription.value.started_at)
  const end = dayjs(subscription.value.expires_at)
  const diffDays = end.diff(start, 'day')
  return diffDays <= 1 // 1 kun yoki kam bo‘lsa — bepul
})

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD')

const getColorClass = (days) => {
  if (days >= 20) return 'bg-green-100 text-green-700'
  if (days >= 10) return 'bg-yellow-100 text-yellow-700'
  if (days >= 2) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

const goToProfile = () => router.push({ name: 'profile', query: { token: token.value } })
const goToGreTest = () => router.push({ name: 'test-page', query: { token: token.value } })
const goToAiTest = () => router.push({ name: 'ai-test', query: { token: token.value } })
const goToPaket = () => router.push({ name: 'paket', query: { token: token.value } })
const goToAdminPanel = () => router.push({ name: 'admin-panel', query: { token: token.value } })
</script>
