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
      <span class="premium-badge">
       Admin
      </span>

      <!-- Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

  <!-- School CRM -->
  <button
    @click="schoolcrm"
    class="relative py-3 px-4 rounded-2xl font-semibold text-white
           bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500
           shadow-lg shadow-indigo-300/40
           hover:shadow-indigo-400/60 hover:scale-[1.04]
           transition-all duration-300 ease-out
           backdrop-blur-xl border border-white/20">
    School CRM
  </button>

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
import { ref, onMounted ,computed} from 'vue'
import axios from '@/plugins/axios'

const user = ref({})

onMounted(async () => {
  const token = localStorage.getItem('api_token')
  if (!token) return

  try {
    const { data } = await axios.get('/api/user/auth/get', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
    user.value = data
  } catch (err) {
    console.error(err)
  }
})
const photoUrl = computed(() => {
  return user.value.photo
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.value.photo}`
    : '/default_person.png'
})
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
const schoolcrm = () => {
  window.location.href = '/schoolcrm'
}
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
.premium-badge {
  position: relative;
  display: inline-block;
  padding: 8px 18px;
  font-weight: 700;
  font-size: 14px;
  color: white;
  border-radius: 9999px;
  background: linear-gradient(90deg, #ffbb33, #ff7a29, #ff4d4d);
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite, badgePulse 3s infinite;
  box-shadow: 0 0 15px rgba(255, 150, 50, 0.4);
  backdrop-filter: blur(6px);
  overflow: hidden;
}

/* Yulduzchalar */
.premium-badge::before,
.premium-badge::after {
  content: "✦";
  position: absolute;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  animation: starFloat 3s infinite ease-in-out;
}

.premium-badge::before {
  top: -4px;
  left: 10px;
}

.premium-badge::after {
  bottom: -4px;
  right: 12px;
  animation-delay: 1.5s;
}

/* Gradient oqib turadi */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Yulduzlar sekin suzadi */
@keyframes starFloat {
  0% { transform: translateY(0); opacity: 0.8; }
  50% { transform: translateY(-6px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.8; }
}

/* Premium nafis puls */
@keyframes badgePulse {
  0%   { box-shadow: 0 0 12px rgba(255,150,50,0.4); }
  50%  { box-shadow: 0 0 18px rgba(255,150,50,0.7); }
  100% { box-shadow: 0 0 12px rgba(255,150,50,0.4); }
}
.logout-btn-small {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;         /* kichikroq padding */
  font-size: 13px;            /* kichikroq shrift */
  font-weight: 600;
  color: #333;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;        /* biroz kichik radius */
  backdrop-filter: blur(6px);
  transition: all .2s ease;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
}

.logout-btn-small:hover {
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.logout-btn-small .icon {
  width: 16px;                /* kichikroq icon */
  height: 16px;
  color: #444;
  transition: transform .2s ease;
}

.logout-btn-small:hover .icon {
  transform: translateX(-2px);
}

.top-right {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>
