<template>
  <div class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 overflow-hidden">
    <!-- Orqa fon effekt -->
    <div class="absolute inset-0">
      <div class="absolute w-96 h-96 bg-indigo-400/20 blur-3xl rounded-full -top-20 -left-20 animate-pulse"></div>
      <div class="absolute w-96 h-96 bg-blue-400/20 blur-3xl rounded-full -bottom-20 -right-20 animate-pulse delay-1000"></div>
    </div>

    <!-- Forma card -->
    <div class="relative backdrop-blur-xl bg-white/40 border border-white/30 shadow-2xl rounded-3xl w-full max-w-md p-10 text-center space-y-6 transition-all duration-500 hover:scale-[1.01]">
      <h2 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        👋 Ro‘yxatdan o‘tish
      </h2>

      <!-- Xabar -->
      <div
        v-if="message"
        :class="message.startsWith('✅') ? 'text-green-600' : 'text-red-600'"
        class="text-center mb-4 text-sm font-semibold"
      >
        {{ message }}
      </div>

      <!-- Forma -->
      <form @submit.prevent="submitForm" class="space-y-5">
        <div class="text-left">
          <label class="block text-sm mb-1 font-medium text-gray-700">Ism</label>
          <input
            v-model="firstName"
            type="text"
            placeholder="Ismingizni kiriting"
            class="w-full rounded-xl border border-gray-300/60 bg-white/70 shadow-sm p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all outline-none"
          />
        </div>

        <div class="text-left">
          <label class="block text-sm mb-1 font-medium text-gray-700">Familiya</label>
          <input
            v-model="lastName"
            type="text"
            placeholder="Familiyangizni kiriting"
            class="w-full rounded-xl border border-gray-300/60 bg-white/70 shadow-sm p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all outline-none"
          />
        </div>

        <div class="text-left">
          <label class="block text-sm mb-1 font-medium text-gray-700">Telefon</label>
          <input
            v-model="phone"
            type="text"
            placeholder="+998..."
            class="w-full rounded-xl border border-gray-300/60 bg-white/70 shadow-sm p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all outline-none"
          />
        </div>

        <!-- Tugma -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
        >
          <span v-if="loading">⏳ Yuborilmoqda...</span>
          <span v-else>🚀 Saqlash</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const loading = ref(false)
const message = ref('')

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  token.value = urlParams.get('token')

  if (!token.value) {
    message.value = '❌ Token topilmadi.'
    return
  }

  try {
    const { data } = await axios.get('/api/parent/auth/get', {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    // Agar foydalanuvchi allaqachon ismga ega bo‘lsa → home ga o‘t
    if (data.first_name) {
      router.push({ name: 'welcome', query: { token: token.value } })
    }
  } catch {
    message.value = '❌ Maʼlumot olishda xatolik.'
  }
})

const submitForm = async () => {
  if (!firstName.value || !lastName.value || !phone.value) {
    message.value = '❗ Iltimos, ism, familiya va telefonni kiriting.'
    return
  }

  loading.value = true
  message.value = ''

  try {
    await axios.put('/api/parent/update', {
      first_name: firstName.value,
      last_name: lastName.value,
      phone: phone.value
    }, {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    message.value = '✅ Maʼlumotlar yangilandi!'
    setTimeout(() => router.push({ name: 'welcome', query: { token: token.value } }), 1000)
  } catch {
    message.value = '❌ Xatolik yuz berdi.'
  } finally {
    loading.value = false
  }
}
</script>

