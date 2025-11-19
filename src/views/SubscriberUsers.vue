<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-10">💎 Obunachilar</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
      <div
        v-for="item in menuItems"
        :key="item.title"
        @click="goTo(item.route)"
        class="relative cursor-pointer rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200"
        :class="item.bgClass"
      >
      <!-- 🔴 Almashtirilgan badge -->
<span
  v-if="item.getBadge && item.getBadge() > 0"
  :class="[
    'absolute -top-2 -right-2 text-white text-xs font-semibold rounded-full w-14 h-7 flex items-center justify-center shadow-md transition-all duration-300',
    getBadgeColor(item.title)
  ]"
>
  {{ item.getBadge() }}
</span>


        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">{{ item.title }}</h2>
          <div class="bg-white/20 rounded-full p-2 backdrop-blur-md">
            <component :is="item.icon" class="w-6 h-6 text-gray-700" />
          </div>
        </div>
        <p class="text-gray-700 text-sm">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Users, Clock, Activity } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import axios from "@/plugins/axios";

const token = ref(new URLSearchParams(window.location.search).get('token'))
const users = ref([])
const expiredUsers = ref([])
const activeUsers = ref([])
const DebtUsers = ref([])
const search = ref(null)
const router = useRouter()

const fetchUsers = async () => {
  try {
    const { data } = await axios.post(
      "/api/lists/all/users/list",
      { telegram_id: search.value || null },
      { headers: { Authorization: `Bearer ${token.value}` } }
    )
    users.value = data
  } catch (error) {
    console.error("❌ Userlarni olishda xatolik:", error)
  }
}

const fetchExpiredUsers = async () => {
  try {
    const { data } = await axios.post("/api/lists/expired/users/list", 
    { telegram_id: search.value || null },
    { headers: { Authorization: `Bearer ${token.value}` } }
)
    expiredUsers.value = data
  } catch (error) {
    console.error("❌ Tugagan obunalarni olishda xatolik:", error)
  }
}
const fetchActiveUsers = async () => {
  try {
    const { data } = await axios.post("/api/lists/active/users/list", { telegram_id: search.value || null },
      { headers: { Authorization: `Bearer ${token.value}` } }
    )
    activeUsers.value = data
  } catch (error) {
    console.error("❌ Active obunalarni olishda xatolik:", error)
  }
}
const fetchDebtUsers = async () => {
  try {
    const { data } = await axios.post("/api/lists/debtor/users/list", { telegram_id: search.value || null },
      { headers: { Authorization: `Bearer ${token.value}` } }
    )
    DebtUsers.value = data
  } catch (error) {
    console.error("❌ Debt obunalarni olishda xatolik:", error)
  }
}

onMounted(() => {
  fetchUsers()
  fetchExpiredUsers()
  fetchDebtUsers()
  fetchActiveUsers()
})
const getBadgeColor = (title) => {
  switch (title) {
    case 'Barcha foydalanuvchilar':
      return 'bg-gray-500 shadow-gray-400/50'
    case 'Active obunachilar':
      return 'bg-green-500 shadow-green-400/50'
    case 'Qarzdorlar':
      return 'bg-yellow-500 text-gray-900 shadow-yellow-300/50'
    case 'Obunasi tugaganlar':
      return 'bg-red-500 animate-pulse shadow-red-400/50'
    default:
      return 'bg-blue-500'
  }
}
// 🔹 Pastel va nafis gradientlar
const menuItems = [
  {
    title: 'Active obunachilar',
    description: 'Hozirda faol obunaga ega foydalanuvchilar',
    route: '/active/users',
    icon: Users,
    bgClass: 'bg-gradient-to-tr from-green-50 via-green-100 to-green-200', // 🌿 pastel yashil
    getBadge: () => activeUsers.value.length
  },
  {
    title: 'Qarzdorlar',
    description: 'To‘lovni qisman amalga oshirgan foydalanuvchilar',
    route: '/debt/users',
    icon: Activity,
    bgClass: 'bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200', // 🌼 yumshoq sariq
    getBadge: () => DebtUsers.value.length
  },
  {
    title: 'Obunasi tugaganlar',
    description: 'Obunasi muddati tugagan foydalanuvchilar',
    route: '/expired/users',
    icon: Clock,
    bgClass: 'bg-gradient-to-bl from-pink-50 via-pink-100 to-pink-200', // 🌸 pastel pushti
    getBadge: () => expiredUsers.value.length
  },
]



const goTo = (route) => {
  router.push({ path: route, query: { token: token.value } })
}
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
