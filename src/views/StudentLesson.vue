<template>
  <div class="p-6 sm:p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl sm:text-3xl font-bold mb-6 text-indigo-600 text-center">
      Haftalik Dars Jadvali
    </h1>

    <div class="overflow-x-auto">
      <div class="inline-block min-w-[600px] sm:min-w-[700px]">
        <!-- Header: Kunlar -->
        <div class="flex border-b">
          <div class="w-12 sm:w-20 border-r bg-gray-200 p-1 sm:p-2 text-[10px] sm:text-sm text-center">
            Soat
          </div>
          <div
            v-for="day in weekDays"
            :key="day.date"
            class="flex-1 border-r relative min-w-[80px] sm:min-w-[100px]"
            :class="isToday(day.date) ? 'bg-yellow-100' : 'bg-gray-100'"
          >
            <div class="sticky top-0 bg-inherit z-10 p-1 sm:p-2 text-[10px] sm:text-sm text-center">
              {{ day.label }}<br>
              <span class="text-gray-500 text-[8px] sm:text-sm">{{ day.display }}</span>
            </div>

            <!-- Kartochkalar -->
            <div
              v-for="group in getGroupsAtDay(day.id)"
              :key="group.id"
              class="absolute left-1 right-1 rounded-lg px-1 sm:px-2 py-0.5 sm:py-1 text-white shadow-sm text-[8px] sm:text-xs z-20 break-words"
              :style="getGroupStyle(group)"
            >
              {{ group.name }}<br>
              <span class="text-[7px] sm:text-[10px]">
                {{ group.start_time }} - {{ group.end_time }}
              </span>
            </div>
          </div>
        </div>

        <!-- Soatlar -->
        <div class="flex">
          <div class="w-12 sm:w-20 border-r relative">
            <div
              v-for="hour in hours"
              :key="hour"
              class="h-8 sm:h-12 border-b flex items-center justify-center text-[8px] sm:text-[10px]"
            >
              {{ hour }}
            </div>
          </div>
          <div
            v-for="day in weekDays"
            :key="day.date"
            class="flex-1 border-r relative min-w-[80px] sm:min-w-[100px]"
            :class="isToday(day.date) ? 'bg-yellow-50' : 'bg-gray-100'"
            :style="{ height: totalHeight + 'px' }"
          >
            <div v-for="hour in hours" :key="hour" class="h-8 sm:h-12 border-b"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const weekNames = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

const weekDays = ref([])
const groups = ref([])
const hours = ref(generateHours())
const userId = route.query.user_id

const hourHeight = 32.48 // telefon uchun biroz kichik
const totalHeight = hourHeight * hours.value.length

function generateHours() {
  const arr = []
  for (let h = 6; h <= 23; h++) arr.push(`${h.toString().padStart(2,'0')}:00`)
  return arr
}

function formatDate(d) {
  const date = new Date(d)
  return `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}`
}

async function fetchGroups() {
  const token = localStorage.getItem('api_token')
  const { data } = await axios.post('/api/group_lesson/list', {
    user_id: userId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a78bfa', '#10b981', '#f97316']
  groups.value = data.map((g, idx) => ({ ...g, color: colors[idx % colors.length] }))
}

function toLocalDateString(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2,'0') + '-' +
    String(date.getDate()).padStart(2,'0')
}

function isToday(dateStr) {
  const now = new Date()
  const todayLocal = toLocalDateString(now)
  return todayLocal === dateStr
}

function generateWeek() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

  weekDays.value = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    weekDays.value.push({
      id: i + 1,
      label: weekNames[i],
      display: formatDate(d),
      date: toLocalDateString(d)
    })
  }
}

function getGroupsAtDay(dayId) {
  return groups.value.filter(g => g.week_days.includes(dayId))
}

function getGroupStyle(group) {
  const startHour = parseInt(group.start_time.slice(0,2))
  const startMin = parseInt(group.start_time.slice(3,5))
  const endHour = parseInt(group.end_time.slice(0,2))
  const endMin = parseInt(group.end_time.slice(3,5))

  // 6:00 boshlanishi uchun offset
  const startHourIndex = startHour - 5
  const endHourIndex = endHour - 5

const topPx = startHourIndex * hourHeight + (startMin / 60) * hourHeight
  const heightPx = (endHourIndex - startHourIndex) * hourHeight + ((endMin - startMin)/60)*hourHeight

  return {
    top: topPx + 'px',
    height: heightPx + 'px',
    backgroundColor: group.color,
    fontSize: '0.4rem',
    padding: '2px'
  }
}

onMounted(() => {
  generateWeek()
  fetchGroups()
})
</script>

<style scoped>
.relative { position: relative; }
.absolute { position: absolute; }

/* Telefonlar uchun responsive */
@media (max-width: 640px) {
  .h-12 { height: 40px; }
  .p-2 { padding: 0.25rem; }
  .text-sm { font-size: 10px; }
}
</style>
