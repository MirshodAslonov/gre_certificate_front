<template>
  <div class="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center p-6">
    <!-- Orqa fon effektlari -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[150px] opacity-20 animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-400 rounded-full blur-[150px] opacity-20 animate-pulse-slow delay-1000"></div>
    </div>

    <!-- User Card -->
    <div class="relative z-10 bg-white/70 backdrop-blur-3xl border border-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-md text-center animate-fadeInUp">
      
      <!-- Photo -->
      <div class="mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg mb-4">
        <img :src="photoUrl" alt="User Photo" class="w-full h-full object-cover"/>
      </div>

      <!-- User Info -->
      <h1 class="text-2xl font-bold text-gray-800 mb-1">{{ user.first_name }} {{ user.last_name }}</h1>
      <p class="text-sm text-gray-600 mb-4">{{ user.phone }}</p>

      <!-- Premium Badge -->
      <span class="inline-block bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-lg mb-6">
         {{ user.role?.name }}
      </span>

      <!-- Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button @click="student_lesson" class="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 text-gray-800 font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 flex items-center justify-center gap-2">
          📅 Dars jadvali
        </button>

        <button 
          v-if="user.role?.name === 'teacher'" 
          @click="$router.push({ name: 'teacher_group_attendance' })"
        class="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-green-200 via-green-300 to-green-200 text-gray-800 font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 flex items-center justify-center gap-2">
          📝 Davomat
        </button>
        <!-- <button class="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-400 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 flex items-center justify-center gap-2">
          💰 Oylik to‘lov
        </button> -->
        <button @click="logout" class="logout-btn-small top-right">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-2"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Chiqish
      </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'
const router = useRouter()

const user = ref({})

onMounted(async () => {
  const token = localStorage.getItem('api_token')
  if (!token) return

  try {
    const { data } = await axios.get('/api/user/auth/get', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
    user.value = data
     if (data.role_id == 1) {
      router.push({ name: 'admin_home' })
      return
    }
  } catch (err) {
    console.error(err)
  }
})


const student_lesson = () => {
  router.push({
    name: 'student_lesson',          
    query: { user_id: user.value.id }  
  })
}

const logout = async () => {
  const token = localStorage.getItem('api_token')
  if (!token) return

  try {
    await axios.post('/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })

    localStorage.removeItem('api_token')
    window.location.href = '/login'

  } catch (error) {
    console.error('Logout error:', error)
  }
}

  const photoUrl = computed(() => {
  return user.value.photo
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.value.photo}`
    : '/default_person.png'
})
</script>

<style>
@keyframes pulse-slow {
  0% { opacity: 0.2; transform: scale(0.95); }
  50% { opacity: 0.4; transform: scale(1.05); }
  100% { opacity: 0.2; transform: scale(0.95); }
}
.animate-pulse-slow {
  animation: pulse-slow 6s infinite ease-in-out;
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
  animation: fadeInUp 1s ease forwards;
}

</style>
