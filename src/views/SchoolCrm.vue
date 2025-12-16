<template>
  <div class="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
    
    <!-- Sidebar -->
    <aside class="w-64 bg-white/80 backdrop-blur-3xl border-r border-white/30 shadow-xl p-6 flex flex-col z-20">
      <div class="mb-8 text-center">
        <div class="mx-auto w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg mb-2">
          <img :src="photoUrl" alt="User Photo" class="w-full h-full object-cover"/>
        </div>
        <h1 class="text-lg font-bold">{{ user.first_name }} {{ user.last_name }}</h1>
        <p class="text-sm text-gray-600">{{ user.phone }}</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1">
        <ul class="space-y-3">
          <li>
            <router-link to="/schoolcrm/dashboard" class="sidebar-btn block text-left">
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/schoolcrm/users" class="sidebar-btn block text-left">
              Foydalanuvchilar
            </router-link>
          </li>
          <li>
            <router-link to="/schoolcrm/groups" class="sidebar-btn block text-left">
              Guruhlar
            </router-link>
          </li>
          <li>
            <router-link to="/schoolcrm/attendance" class="sidebar-btn block text-left">
              Davomat
            </router-link>
          </li>
          <li>
            <router-link to="/schoolcrm/lessons" class="sidebar-btn block text-left">
              Dars jadval
            </router-link>
        </li>
        <li>
            <router-link to="/schoolcrm/dashboard" class="sidebar-btn block text-left">
              To'lovlar
            </router-link>
        </li>
        <li>
            <router-link to="/schoolcrm/hr" class="sidebar-btn block text-left">
              Mijozlar bazasi
            </router-link>
        </li>
        </ul>
      </nav>

      <!-- Logout -->
      <button @click="adminHome" class="mt-auto logout-btn">
        Chiqish
      </button>
    </aside>

    
    <main class="flex-1 p-8 relative z-10">
      <!-- <h2 class="text-2xl font-bold mb-6">Dashboard</h2> -->
      
     
      <!-- <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div class="stat-card">
          <p class="text-sm font-medium text-gray-500">Talabalar soni</p>
          <p class="text-3xl font-bold text-indigo-600">{{ animatedUsers }}</p>
        </div>
        <div class="stat-card">
          <p class="text-sm font-medium text-gray-500">Guruhlar soni</p>
          <p class="text-3xl font-bold text-purple-600">{{ animatedGroups }}</p>
        </div>
        <div class="stat-card">
          <p class="text-sm font-medium text-gray-500">Oylik daromad</p>
          <p class="text-3xl font-bold text-green-600">{{ animatedRevenue }}</p>
        </div>
      </div> -->

     
      <div class="bg-white/70 backdrop-blur-3xl rounded-3xl p-6 shadow-2xl min-h-[500px]">
         <router-view />
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/plugins/axios'

// Import page components
import UsersPage from './UsersPage.vue'
import GroupsPage from './GroupsPage.vue'
import Lessons from './Lessons.vue'
// import AttendancePage from './AttendancePage.vue'
// import HRPage from './HRPage.vue'

// User ma'lumotlari
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

// User photo
const photoUrl = computed(() => {
  return user.value.photo
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.value.photo}`
    : '/default_person.png'
})

// Logout
const adminHome = () => {
     window.location.href = '/admin_home'
}

// Sidebar orqali sahifa tanlash
const currentPage = ref('users')

// Dynamic component mapping
const currentPageComponent = computed(() => {
  switch(currentPage.value) {
    case 'users': return UsersPage
    case 'groups': return GroupsPage
    case 'attendance': return AttendancePage
    case 'hr': return HRPage
    case 'lessons': return Lessons
    default: return null
  }
})
// Stat cards animation

const usersCount = 0
const groupsCount = 0
const monthlyRevenue = 0

const statistics = ref({
  users_count: 0,
  group_count: 0,
  paid_amount: 0
})
const animatedUsers = ref(0)
const animatedGroups = ref(0)
const animatedRevenue = ref(0)

function animateValue(refValue, target, duration = 1000){
  const startValue = refValue.value
  const startTime = performance.now()
  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    refValue.value = Math.floor(startValue + progress * (target - startValue))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
async function fetchStatistics() {
  const token = localStorage.getItem('api_token')

  try {
    const { data } = await axios.post('/api/admin/statistics/dashboard', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })

    // API endi obyekt qaytaradi
    statistics.value = data

    const users = Number(data.users_count || 0)
    const groups = Number(data.group_count || 0)
    const revenue = Math.floor(parseFloat(data.paid_amount || 0))

    animateValue(animatedUsers, users, 500)
    animateValue(animatedGroups, groups, 500)
    animateValue(animatedRevenue, revenue, 500)

  } catch (err) {
    console.error("Statistics fetch error:", err)
  }
}

onMounted(() => {
  fetchStatistics()
})

// onMounted(() => {
//   animateValue(animatedUsers, usersCount, 500)
//   animateValue(animatedGroups, groupsCount, 500)
//   animateValue(animatedRevenue, monthlyRevenue, 500)
// })
</script>

<style>
.sidebar-btn {
  width: 100%;
  padding: 10px 14px;
  color: #444;
  border-radius: 12px;
  transition: all 0.2s;
  backdrop-filter: blur(6px);
  background: rgba(255,255,255,0.55);
}
.sidebar-btn:hover {
  background: rgba(255,255,255,0.75);
  transform: translateX(2px);
}
.logout-btn {
  width: 100%;
  margin-top: 4rem;
  padding: 10px 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg,#f43f5e,#fb7185);
  border-radius: 12px;
  transition: all .2s;
}
.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}
.stat-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-5px) scale(1.02);
}
</style>
