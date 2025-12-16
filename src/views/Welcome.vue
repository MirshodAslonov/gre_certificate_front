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
    </div>
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
    // ❗ Welcome ham parent API-ga bog‘lanadi
    const { data } = await axios.get('/api/parent/auth/get', {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    // Agar foydalanuvchida ism hali yo‘q bo‘lsa → registerga qaytarish
    if (!data.first_name) {
      router.push({ name: 'register', query: { token: token.value } })
      return
    }

    // Aks holda ismni chiqaramiz
    userName.value = `${data.first_name} ${data.last_name ?? ''}`.trim()

  } catch {
    router.push({ name: 'register', query: { token: token.value } })
  }
})
</script>

