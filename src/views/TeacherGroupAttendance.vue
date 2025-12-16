<template>
  <div class="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center p-6">

    <!-- BG Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[150px] opacity-20 animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-400 rounded-full blur-[150px] opacity-20 animate-pulse-slow delay-1000"></div>
    </div>

    <!-- CONTENT -->
    <div class="relative z-10 w-full max-w-md">

      <!-- Date -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          📅 Bugungi darslar
        </h1>
        <p class="text-gray-600 mt-1 text-lg font-medium">
          {{ todayFormatted }}
        </p>
      </div>

      <!-- Groups List -->
      <div v-if="groups.length" class="space-y-4">
        <div
          v-for="g in groups"
          :key="g.group_id"
          class="p-5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl transition hover:shadow-2xl"
        >
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold text-gray-800">
              {{ g.group_name }}
              </h2>
              <p class="text-gray-600 text-sm">
                🕒 {{ g.start_time }} — {{ g.end_time }}
              </p>
            </div>

            <button
              @click="startAttendance(g.group_id)"
              class="px-4 py-2 rounded-xl font-semibold shadow-md transition 
                     bg-gradient-to-r from-green-400 to-emerald-500 text-white
                     hover:scale-105 hover:shadow-lg"
            >
              {{ g.attendance_opened ? 'Davom ettirish' : 'Boshlash' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center text-gray-500 italic mt-10">
        Bugun darslar mavjud emas.
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import axios from "@/plugins/axios"
import { useRouter } from "vue-router"

const router = useRouter()
const groups = ref([])

/* 💠 Bugungi sanani formatlash */
const todayFormatted = computed(() => {
  const d = new Date()
  const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
})

/* 💠 API’dan bugungi darslarni olish */
onMounted(async () => {
  const token = localStorage.getItem("api_token")

  try {
    const { data } = await axios.post("/api/group_attendance/today/user/group/list",
      {},
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    )
    groups.value = data
  } catch (error) {
    console.error("API ERROR:", error)
  }
})

/* 💠 Boshlash tugmasi */
const startAttendance = async (groupId) => {
  const token = localStorage.getItem("api_token")

  const { data } = await axios.post(
    "/api/group_attendance/add",
    { group_id: groupId },
    { headers: { Authorization: `Bearer ${token}` , Accept: 'application/json' } }
  )
    
  router.push({
    name: "attendance_page",
    query: { group_attendance_id: data.id }
  })
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
</style>
