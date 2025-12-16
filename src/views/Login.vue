<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">

    <!-- Card -->
    <div 
      class="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl transform transition-all duration-500"
    >
      <!-- Logo -->
<div class="flex justify-center mb-10">
  <div class="relative">

    <!-- Neon Aura -->
    <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 
                blur-2xl opacity-60 rounded-full animate-pulse-slow"></div>

    <!-- Outer Gradient Ring -->
    <div class="absolute inset-0 rounded-full p-[3px] bg-gradient-to-br 
                from-indigo-500 via-purple-500 to-blue-500"></div>

    <!-- Logo Circle -->
    <div 
      class="relative w-32 h-32 rounded-full overflow-hidden bg-white shadow-2xl 
      flex items-center justify-center backdrop-blur-xl 
      hover:scale-105 transition-all duration-500 border border-white/50"
    >
      <img 
        src="/aslonov_icon.png"
        alt="Logo"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</div>

      <!-- <h2 class="text-3xl font-bold text-center mb-2 text-gray-800">
        Xush kelibsiz
      </h2> -->
     

      <!-- Form -->
      <form @submit.prevent="login" :class="shake ? 'animate-shake' : ''">

        <!-- Telefon input -->
        <div class="mb-5">
          <label class="text-gray-700 font-medium">Telefon raqam</label>

          <div class="relative mt-2">
            <input
              type="text"
              v-model="phone"
              @input="formatPhone"
              maxlength="12"
              placeholder="+998..."
              class="w-full pl-5 px-4 py-3 rounded-xl bg-gray-100 focus:bg-white 
              border border-transparent focus:border-indigo-500 focus:ring-4 
              focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
        </div>

 <div class="mb-5 relative">
  <label class="text-gray-700 font-medium">Parol</label>
  <input
    :type="showPassword ? 'text' : 'password'"
    v-model="password"
    placeholder="••••••••"
    class="w-full mt-2 px-4 py-3 rounded-xl bg-gray-100 focus:bg-white 
           border border-transparent focus:border-indigo-500 focus:ring-4 
           focus:ring-indigo-200 outline-none pr-10"
  />
  <button type="button" @click="showPassword = !showPassword"
           class="absolute top-[69%] right-4 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition">
    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.182-3.401M6.45 6.45a9.969 9.969 0 015.55-2.95M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 3l18 18"/>
    </svg>
  </button>
</div>




        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          Kirish
        </button>
        <!-- Footer -->
<div class="mt-10 text-center text-gray-500 text-sm opacity-70">
  <span class="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
    © {{ new Date().getFullYear() }} Aslonov — Barcha huquqlar himoyalangan.
  </span>
</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from '@/plugins/axios'

const router = useRouter()

const phone = ref("")
const password = ref("")
const shake = ref(false)

const formatPhone = () => {
  phone.value = phone.value.replace(/\D/g, "").slice(0, 12)
}

const login = async () => {
  if (!phone.value || !password.value) {
    shake.value = true
    setTimeout(() => (shake.value = false), 600)
    return
  }

  const backendPhone = phone.value

  try {
    const response = await axios.post('/api/login', 
      {
        phone: backendPhone,
        password: password.value
      },
      {
        headers: {
          'Accept': 'application/json',  // shu kerak
          'Content-Type': 'application/json' // odatda shart emas, lekin qo‘shsak xavfsiz
        }
      }
    )

    const { token, user } = response.data
    localStorage.setItem('api_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    router.push({ name: 'home' })
  } catch (error) {
    console.log(error.response?.data || error)
    shake.value = true
    setTimeout(() => (shake.value = false), 600)
  }
}
const showPassword = ref(false)

const goToRegister = () => {
  router.push({ name: "register" })
}
</script>


<style>
@keyframes pulse-slow {
  0% { opacity: 0.5; transform: scale(0.95); }
  50% { opacity: 0.9; transform: scale(1.05); }
  100% { opacity: 0.5; transform: scale(0.95); }
}

.animate-pulse-slow {
  animation: pulse-slow 4s infinite ease-in-out;
}
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 5s linear infinite;
}
</style>
