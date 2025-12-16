<template>
  <div class="p-6 min-h-screen bg-gray-100">

    <!-- Sana -->
    <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">
      📅 {{ todayDayFormatted }} — {{ todayFormatted }}
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-500 mt-10">
      Yuklanmoqda...
    </div>

          <div class="mb-4 flex items-center justify-center gap-4">
                <!-- Chap strelka -->
                <button 
                  @click="prevMonth" 
                  class="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  ◀
                </button>

                <!-- Oyning nomi -->
                <h2 class="font-semibold text-gray-800 text-lg">
                  {{ monthLabel(selectedMonth) }}
                </h2>

                <!-- O'ng strelka -->
                <button 
                  @click="nextMonth" 
                  class="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  ▶
                </button>
           </div>

      <div
        v-for="s in students"
        :key="s.id"
        class="flex justify-between items-center bg-white p-2 mb-2 rounded-xl shadow"
        @click="goToUser(s.user_id)"
      >
        <div class="flex items-center gap-4 ">
        <img
            :src="getUserPhoto(s.image)"
            class="object-cover border rounded-full cursor-pointer"
            style="width: 80px; height: 80px;"
            alt="avatar"
            @click.stop="openImageModal(getUserPhoto(s.image))"
        />

          <div>
            <p class="font-semibold text-gray-800 text-lg">
              {{ s.full_name }}
            </p>
           
         <div class="grid grid-cols-[40px_repeat(2,1fr)] items-center gap-1 w-[130px]"> 
            <div v-for="(cnt, idx) in s.month_lessons" :key="idx" class="text-center">
                <div class="text-[10px] text-gray-500 mb-1">{{ idx + 1 }}-hafta</div>

                <!-- Doirachalar (count) -->
                <div class="flex items-center justify-center gap-0.5">
                <template v-for="n in cnt">
                  <span
                    class="w-2 h-2 rounded-full border-[1px] border-transparent"
                    :class="{
                      'bg-gray-400': Object.values(n)[0] === -1,
                      'bg-red-500': Object.values(n)[0] === 0,
                      'bg-green-500': Object.values(n)[0] === 1,
                      'border-yellow-400': n.paid === true, // agar premium bo‘lsa tilla ramka
                      'shadow-md': n.paid === true // optional: biroz 3D effekt
                    }"
                  ></span>
                </template>
              </div>

            </div>
            </div>
    
          </div>
        </div>

        <div v-if="showImageModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" @click="closeImageModal">
          <img :src="selectedImage" class="max-w-full max-h-full object-contain rounded-xl shadow-2xl">
        </div>

        <!-- Modern Switch Checkbox -->
        <label class="switch" @click.stop>
          <input type="checkbox"
            :checked="s.status == 1"
            
            @change="updateStatus(s)"
          >
          <span class="slider"></span>
        </label>

      </div>
  

    <!-- Image Modal (global) -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" @click="closeImageModal">
      <img :src="selectedImage" class="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import axios from "@/plugins/axios"
import { useRoute } from "vue-router"
import { useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const selectedMonth = ref('') // tanlangan oy


/* --- Existing state --- */
const group_attendance_id = Number(route.query.group_attendance_id || 0)
const students = ref([])

const loading = ref(true)

/* Image modal */
const showImageModal = ref(false)
const selectedImage = ref('')
function openImageModal(url) {
  selectedImage.value = url
  showImageModal.value = true
}
function closeImageModal() {
  showImageModal.value = false
  selectedImage.value = ''
}

function goToUser(id) {
  router.push({ name: 'user_page', params: { id } })
}

/* Sana formatlash */
const todayFormatted = computed(() => {
  const d = new Date()
  const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
})
const todayDayFormatted = computed(() => {
  const d = new Date()
  const days = ['Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba','Yakshanba']
  // JS da getDay(): 0 = Yakshanba, 1 = Dushanba, ...
  const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1
  return days[dayIndex]
})

const monthNames = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
// oy nomini formatlash
const monthLabel = (monthStr) => {
  const [year, month] = monthStr.split('-')
  return `${monthNames[Number(month)-1]} ${year}`
}

// Oyni 1 oy oldinga
const nextMonth = () => {
  const [year, month] = selectedMonth.value.split('-').map(Number)
  let d = new Date(year, month, 1) // 1 oy keyingi
  selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
  loadStudents()
}

// Oyni 1 oy orqaga
const prevMonth = () => {
  const [year, month] = selectedMonth.value.split('-').map(Number)
  let d = new Date(year, month-2, 1) // 1 oy orqaga
  selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
  loadStudents()
}

onMounted(async () => {
   if (!selectedMonth.value) {
    const d = new Date()
    selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`
  }
  loadStudents()
})

const loadStudents = async () => {
  // loading.value = true
  try {
    const token = localStorage.getItem("api_token")

    const res = await axios.post(
      "/api/attendance/list",
      { group_attendance_id: group_attendance_id 
        , month: selectedMonth.value
      },
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    )

    const data = res.data || []

    students.value = data.map(item => ({
      id: item.id,
      user_id: item.user.id,
      full_name: (item.user.first_name || '') + ' ' + (item.user.last_name || ''),
      image: item.user.photo,
      status: item.status,
      month_lessons: item.month_lessons,
    }))

  } catch (e) {
    console.error("LOAD ERROR:", e)
  }
  loading.value = false
}
/* Get user photo helper (same as before) */
const getUserPhoto = (photo) => {
  return photo
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${photo}`
    : '/default_person.png'
}

/* Update status (same as before) */
const updateStatus = async (s) => {
  const token = localStorage.getItem("api_token")
  s.status = s.status == 1 ? '0' : '1'

  try {
    await axios.put(
      "/api/attendance/update",
      { id: s.id, status: s.status },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    await loadStudents()
  } catch (error) {
    console.error("UPDATE ERROR:", error)
  }
}

</script>

<style>
/* Switch wrapper */
.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 42px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* OUTER CIRCLE (kuchli rang) */
.slider {
  position: absolute;
  inset: 0;
  cursor: pointer;
  border-radius: 50%;
  transition: 0.3s;
  background: radial-gradient(
    circle,
    rgba(239, 68, 68, 0.15) 20%,
    rgb(209, 7, 7) 100%
  );
}

/* INNER CIRCLE (soft) */
.slider:before {
  content: "";
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  transition: 0.3s ease;
  background-color: rgba(239, 68, 68, 0.25);
}

/* 🟢 ON — outer ring kuchli yashil */
input:checked + .slider {
  background: radial-gradient(
    circle,
    rgba(34, 197, 94, 0.15) 20%,
    rgb(3, 165, 3) 100%
  );
}

/* 🟢 ON — inner soft */
input:checked + .slider:before {
  background-color: rgba(34, 197, 94, 0.25);
}

/* small circle (header row) style */
.small-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #9ca3af; /* gray-400 */
  opacity: 0.9;
}

/* tiny dot for compact row */
.tiny-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #9ca3af;
  opacity: 0.9;
}
button {
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  transform: scale(1.1);
  transition: 0.2s;
}
</style>
