<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-10">Mijozlar bazasi</h1>

    <!-- Loading Skeleton -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl animate-pulse"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="rounded-2xl p-6 shadow-lg border border-gray-200 bg-white relative"
      >
        <div class="absolute -top-2 -right-2 w-14 h-7 rounded-full bg-gray-300"></div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-32 h-5 bg-gray-300 rounded"></div>
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
        <div class="space-y-2">
          <div class="w-full h-3 bg-gray-300 rounded"></div>
          <div class="w-3/4 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
    >
      <div
        v-for="item in menuItems"
        :key="item.title"
        @click="goTo(item.route, item.status_id)"
        class="relative cursor-pointer rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200"
        :class="item.bgClass"
      >
        <!-- Badge -->
        <span
          v-if="item.badge > 0"
          class="absolute -top-2 -right-2 text-white text-xs font-semibold rounded-full w-14 h-7 flex items-center justify-center bg-blue-600 shadow-md"
        >
          {{ item.badge }}
        </span>

        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ item.title }}
          </h2>

          <div class="bg-white/20 rounded-full p-2 backdrop-blur-md">
            <component :is="item.icon" class="w-6 h-6 text-gray-700" />
          </div>
        </div>

        <p class="text-gray-700 text-sm">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { Users } from "lucide-vue-next"
import axios from "@/plugins/axios"

const router = useRouter()

// GLOBALS
const token = ref(new URLSearchParams(window.location.search).get("token"))
const statuses = ref([])
const allUsers = ref([])
const menuItems = ref([])
const isLoading = ref(true)

// 1. Statuses list
const statusesList = async () => {
  try {
    const { data } = await axios.get("/api/user_status/list", {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    statuses.value = data
  } catch (error) {
    console.error("Statuslarni olishda xato:", error)
  }
}

// 2. Hamma userlarni BIR MARTA olish
const fetchAllUsers = async () => {
  try {
    const { data } = await axios.post(
      "/api/lists/all/users/list",
      { status_id: null }, // filter yo‘q — hammasi keladi
      { headers: { Authorization: `Bearer ${token.value}` } }
    )
    allUsers.value = data
  } catch (e) {
    console.error("Userlarni olishda xato:", e)
  }
}

// 4. Gradientlar
const gradientByIndex = (i) => {
  const gradients = [
    "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200",
    "bg-gradient-to-br from-purple-50 via-violet-100 to-violet-200",
    "bg-gradient-to-br from-green-50 via-emerald-100 to-emerald-200",
    "bg-gradient-to-br from-yellow-50 via-amber-100 to-amber-200",
    "bg-gradient-to-br from-pink-50 via-rose-100 to-rose-200",
    "bg-gradient-to-br from-teal-50 via-cyan-100 to-cyan-200",
  ]
  return gradients[i % gradients.length]
}

// 5. Frontda menu yaratish
const generateMenuFromStatuses = () => {
  const items = []

  for (let i = 0; i < statuses.value.length; i++) {
    const st = statuses.value[i]

    items.push({
      title: st.name,
      description: "Status bo‘yicha xodimlar ro‘yxati",
      route: `/hr/status/users`,
      status_id: st.id,
      icon: Users,
      bgClass: gradientByIndex(i),
      badge: st.users_count,
    })
  }

  menuItems.value = items
}

// 6. Route
const goTo = (route, statusId) => {
  router.push({
    path: route,
    query: { token: token.value, status_id: statusId },
  })
}

// 7. On mounted
onMounted(async () => {
  await statusesList()
  await fetchAllUsers()
  generateMenuFromStatuses()
  isLoading.value = false
})
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
