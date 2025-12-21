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
         Biz bilan bog'lanish
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
            placeholder="998990000000"
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

const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const password = ref('')
const passwordConfirm = ref('')

const loading = ref(false)
const message = ref('')

onMounted(() => {
  const token = localStorage.getItem('api_token')
  if (token) {
    router.push({ name: 'home' })
  }
})

const submitForm = async () => {
  if (!firstName.value || !lastName.value || !phone.value) {
    message.value = '❗ Barcha maydonlarni to‘ldiring.'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const { data } = await axios.post('/api/user/register/parent/without_password', {
      first_name: firstName.value,
      last_name: lastName.value,
      phone: normalizePhone(phone.value),
    })

    // agar backend token qaytarsa
    if (data.token) {
      localStorage.setItem('api_token', data.token)
    }

    message.value = '✅ Muvaffaqiyatli ro‘yxatdan o‘tildi!'
    setTimeout(() => router.push({ name: 'home' }), 800)

  } catch (error) {
    message.value = error.response?.data?.message || '❌ Xatolik yuz berdi.'
  } finally {
    loading.value = false
  }
}
const normalizePhone = (value) => {
  // faqat raqamlarni qoldiramiz
  let digits = value.replace(/\D/g, '')

  // agar 9 xonali bo‘lsa (990090909)
  if (digits.length === 9) {
    digits = '998' + digits
  }

  // agar 12 xonali bo‘lsa va 998 bilan boshlanmasa
  if (digits.length === 12 && !digits.startsWith('998')) {
    digits = '998' + digits.slice(-9)
  }

  return digits
}
</script>


