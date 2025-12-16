<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-indigo-600">Haftalik Dars Jadvali</h1>

    <div class="overflow-x-auto">
      <!-- Header: kunlar -->
      <div class="flex border-b">
        <div class="w-20 border-r bg-gray-200 p-2">Soat</div>
        <div v-for="day in weekDays" :key="day.date" class="flex-1 border-r relative"
             :class="isToday(day.date) ? 'bg-yellow-100' : 'bg-gray-100'"
             :style="{ height: hourHeight + 'px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }">
          <div class="sticky top-0 bg-inherit z-10 p-1">
            {{ day.label }} <br>
            <span class="text-sm text-gray-500">{{ day.display }}</span>
          </div>

          <!-- Kartochkalar -->
          <div v-for="group in getGroupsAtDay(day.id)" :key="group.id"
            class="absolute left-1 right-1 rounded-lg p-1 text-white shadow-sm text-xs z-20"
            :style="getGroupStyle(group)">
        {{ group.name }} <br>
        <span class="text-[10px]">{{ group.start_time }} - {{ group.end_time }}</span>
        </div>
        </div>
      </div>

      <!-- Soatlar -->
      <div class="flex">
        <div class="w-20 border-r relative">
          <div v-for="hour in hours" :key="hour" 
               class="h-12 border-b flex items-center justify-center text-sm">
            {{ hour }}
          </div>
        </div>
        <div v-for="day in weekDays" :key="day.date" class="flex-1 border-r relative"
            :class="isToday(day.date) ? 'bg-yellow-50' : 'bg-gray-100'"
             :style="{ height: totalHeight + 'px' }">
          <div v-for="hour in hours" :key="hour" class="h-12 border-b"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'

const weekNames = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

const weekDays = ref([])
const groups = ref([])
const hours = ref(generateHours())

const hourHeight = 48 // px, h-12 = 48px
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
  const { data } = await axios.post('/api/admin/group/list', {}, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const colors = ['#6366f1', '#8b5cf6', '#f97316', '#10b981', '#3b82f6', '#ef4444']
  groups.value = data.map((g, idx) => ({ ...g, color: colors[idx % colors.length] }))
}

function toLocalDateString(date) {
  // YYYY-MM-DD formatida lokal sana
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
  const dayOfWeek = today.getDay() // 0 = Yakshanba
  // Haftaning dushanbasi (local vaqt bilan)
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)) // 0 -> 6, 1 -> 0, 2 -> 1 ...

  weekDays.value = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)

    weekDays.value.push({
      id: i + 1,
      label: weekNames[i],
      display: formatDate(d),         // DD/MM
      date: toLocalDateString(d)      // YYYY-MM-DD
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

  const startHourIndex = startHour - 5
  const endHourIndex = endHour - 5

  const topPx = startHourIndex * hourHeight + (startMin/60)*hourHeight
  const heightPx = (endHourIndex - startHourIndex) * hourHeight + ((endMin - startMin)/60)*hourHeight

  return {
    top: topPx + 'px',
    height: heightPx + 'px',
    backgroundColor: group.color
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
</style>
