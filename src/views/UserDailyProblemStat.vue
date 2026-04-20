<template>
  <div class="p-6 min-h-screen bg-gray-100">
   
    <div class="flex items-center justify-center gap-6 flex-wrap">
    </div>
    <div
      v-if="weekRange"
      class="mb-2 flex justify-center"
    >
      <div
        class="px-8 py-1 rounded-2xl
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400
              text-white text-xl font-bold shadow-xl tracking-wide"
      >
        {{ formatDate(weekRange.from) }}
        <span class="mx-3 opacity-80">—</span>
        {{ formatDate(weekRange.to) }}
      </div>
    </div>
    <div class="flex justify-center mt-4">
  <select
    v-model="selectedGroupId"
    @change="loadStudents"
    class="px-5 py-2 rounded-xl border shadow bg-white
           text-gray-700 font-semibold
           focus:ring focus:ring-indigo-300"
  >
    <option :value="null">📚 Barcha guruhlar</option>
    <option
      v-for="g in groups"
      :key="g.id"
      :value="g.id"
    >
      {{ g.name }}
    </option>
  </select>

  <button
  v-if="authUser?.role?.name === 'teacher' || authUser?.role?.name === 'admin'"
    @click="downloadStyledPDF"
    class="px-4 py-0 bg-indigo-500 text-white font-bold rounded-xl shadow hover:bg-indigo-600 transition"
  >
    📄 PDF Natijalar
  </button>

</div>
    <div class="flex justify-center mt-3 mb-6">
      <input
        v-model="searchText"
        type="text"
        placeholder="🔍 Ism yoki familiya..."
        class="w-80 px-5 py-2 rounded-xl border shadow
              focus:ring focus:ring-pink-300
              transition"
      />
    </div>
    <!-- Students -->
     <div id="students-list">
      <div
        v-for="s in students"
        :key="s.user.id"
        class="bg-white rounded-xl shadow p-4 mb-4"
      >

        <!-- User info + ⭐ total -->
      
  <div class="flex items-center gap-4 mb-3">

    <!-- MEDAL / RANK -->
    <div
      class="w-12 h-12 flex items-center justify-center rounded-full
            font-extrabold text-lg shadow-lg"
      :class="rankClass(s.rank)"
    >
      <span v-if="s.rank === 1">🥇</span>
      <span v-else-if="s.rank === 2">🥈</span>
      <span v-else-if="s.rank === 3">🥉</span>
      <span v-else class="text-xs">#{{ s.rank }}</span>
    </div>

    <!-- AVATAR   @click.stop="openImageModal(getUserPhoto(s.user.photo))" -->
    <img
      :src="getUserPhoto(s.user.photo)"
      class="object-cover border rounded-full cursor-pointer w-16 h-16"
    />

    <!-- NAME + TOTAL -->
    <div class="flex-1">
      <p class="font-semibold text-gray-800 text-lg">
        {{ s.user.first_name }} {{ s.user.last_name }}
      </p>

      <!-- TOTAL PREMIUM -->
      <div
        class="inline-flex items-center gap-2 mt-1
              px-4 py-1.5 rounded-full
              bg-gradient-to-r from-yellow-400 to-orange-500
              text-white font-bold shadow-md"
      >
        ⭐ {{ s.total }}
      </div>
    </div>
  </div>

        <!-- Kunlar -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="(count, date) in s.daily"
            :key="date"
            class="text-sm  rounded"
            :class="isToday(date) ? 'text-red-700' : ''"
          >

            <!-- Kun nomi -->
            <div
              class="text-sm mb-1 w-12  text-center rounded"
              :class="isSunday(date)
                ? 'bg-red-200 text-red-700'
                : 'text-gray-600'"
            >
              {{ weekdayName(date) }}
            </div>

            <!-- Input -->
            <input
              type="number"
              v-model.number="s.daily[date]"
              @change="updateProblem(s.user.id, date, s.daily[date])"
              class="w-12 h-10 text-center rounded border font-semibold
                    focus:ring
                    transition"
              :class="isToday(date)
                ? 'bg-yellow-50 text-gray-500 ring-yellow-300'
                : 'bg-green-50 text-gray-500 focus:ring-green-300'"
              :readonly="!(authUser.role?.name == 'teacher'|| authUser.role?.name == 'admin')"
            />

          </div>
        </div>
      </div>
    </div>
    <!-- Image modal -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      @click="closeImageModal"
    >
      <img
        :src="selectedImage"
        class="max-w-full max-h-full rounded-xl shadow-2xl"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from '@/plugins/axios'

/* STATE */
let searchTimeout = null

const students = ref([])
const loading = ref(false)
const selectedMonth = ref('')
const selectedWeek = ref(1)
const weekRange = ref(null)
const authUser = ref(null)

const groups = ref([])
const selectedGroupId = ref(null)
const searchText = ref('')
/* MODAL */
const showImageModal = ref(false)
const selectedImage = ref('')

const openImageModal = (url) => {
  selectedImage.value = url
  showImageModal.value = true
}
const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = ''
}
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const downloadStyledPDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4')

  // LOGO
  const logoBase64 = await loadImageAsBase64('/aslonov_icon.png')
  pdf.addImage(logoBase64, 'PNG', 10, 8, 18, 18)

  // Aslonov School
  pdf.setFontSize(18)
  pdf.setTextColor(55, 48, 163)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Aslonov School', 32, 18)

  // Subtitle
  pdf.setFontSize(10)
  pdf.setTextColor(120, 120, 120)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Matematika club', 32, 23)

  // Sarlavha
  pdf.setFontSize(16)
  pdf.setTextColor(63, 81, 181)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Haftalik Natijalar', 105, 32, { align: 'center' })

  // Sana
  pdf.setFontSize(11)
  pdf.setTextColor(0)
  pdf.setFont('helvetica', 'normal')
  pdf.text(
    `Hafta: ${formatDate(weekRange.value.from)} — ${formatDate(weekRange.value.to)}`,
    105,
    38,
    { align: 'center' }
  )

  // ================= TABLE =================

  const head = [
    ['O`rin', 'Ism Familiya', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya', 'Jami']
  ]

  const bodyPrepared = students.value.map((s) => {
    const daysOrder = ['Du','Se','Cho','Pa','Ju','Sha','Ya']
    const dailyValues = daysOrder.map(dayName => {
      const date = Object.keys(s.daily).find(d => weekdayName(d) === dayName)
      return date ? s.daily[date] : ''
    })

    let rankFill = [240,240,240]
    let rankTextColor = 0

    if (s.rank === 1) rankFill = [255,215,0], rankTextColor = 255
    else if (s.rank === 2) rankFill = [192,192,192], rankTextColor = 255
    else if (s.rank === 3) rankFill = [205,127,50], rankTextColor = 255

    return {
      rankFill,
      rankTextColor,
      raw: [
        s.rank,
        `${s.user.first_name} ${s.user.last_name}`,
        ...dailyValues,
        s.total,
      ]
    }
  })

  autoTable(pdf, {
    startY: 45, // 🔥 MUHIM: headerdan past
    head,
    body: bodyPrepared.map(r => r.raw),
    theme: 'grid',
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fillColor: [245, 245, 245],
      textColor: 0,
      fontSize: 10
    },
    didParseCell(data) {
      const row = bodyPrepared[data.row.index]

      if (data.section === 'body' && data.column.index === 0) {
        data.cell.styles.fillColor = row.rankFill
        data.cell.styles.textColor = row.rankTextColor
        data.cell.styles.fontStyle = 'bold'
      }

      if (data.section === 'body' && data.column.index === 9) {
        data.cell.styles.fillColor = [102, 187, 106]
        data.cell.styles.textColor = 255
        data.cell.styles.fontStyle = 'bold'
      }
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 15 },
      3: { cellWidth: 15 },
      4: { cellWidth: 15 },
      5: { cellWidth: 15 },
      6: { cellWidth: 15 },
      7: { cellWidth: 15 },
      8: { cellWidth: 15 },
      9: { cellWidth: 20 },
    }
  })

  // ================= FOOTER =================

  const pageHeight = pdf.internal.pageSize.height
  const buttonY = pageHeight - 25

  pdf.setFillColor(79, 70, 229)
  pdf.roundedRect(70, buttonY, 70, 12, 6, 6, 'F')

  pdf.setTextColor(255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Saytimizga kirish', 105, buttonY + 8, { align: 'center' })

  pdf.link(70, buttonY, 70, 12, {
    url: 'https://aslonovschool.uz'
  })

  pdf.setFontSize(9)
  pdf.setTextColor(120)
  pdf.setFont('helvetica', 'normal')
  pdf.text(
    'https://aslonovschool.uz',
    105,
    buttonY + 17,
    { align: 'center' }
  )

  pdf.save(`weekly-results-${new Date().toISOString().slice(0,10)}.pdf`)
}

const isToday = (date) => {
  const d = new Date()
  const today = d.toISOString().slice(0,10)
  return date === today
}
watch(searchText, () => {
  // oldingi timer bo‘lsa to‘xtatamiz
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // 300ms dan keyin zapros
  searchTimeout = setTimeout(() => {
    loadStudents()
  }, 2)
})
/* API */
const loadStudents = async () => {
  loading.value = true
  try {
    if (!selectedMonth.value) {
      const d = new Date()
      selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    }

    const token = localStorage.getItem('api_token')
    const body = {
      group_id: selectedGroupId.value || null,
      search: searchText.value?.trim() || null
    }
    const res = await axios.post(
      '/api/teacher/user_daily_problem_stat/list/by/week',
      body,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    weekRange.value = res.data.week_range

    students.value = (res.data.data || []).map((i) => ({
      ...i,
      // rank backend tomonidan berilgan
      rank: i.rank
    }))
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}
const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: 'long'
  })
}
const rankClass = (rank) => {
  if (rank === 1) return 'rank-medal rank-1'
  if (rank === 2) return 'rank-medal rank-2'
  if (rank === 3) return 'rank-medal rank-3'
  return ' rank-other'
}
/* UPDATE */
const updateProblem = async (user_id, date, problems_count) => {
  try {
    const token = localStorage.getItem('api_token')
    await axios.post(
      '/api/teacher/user_daily_problem_stat/add_or_update',
      { user_id, date, problems_count },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    loadStudents()
  } catch (e) {
    console.error(e)
  }
}
const loadGroups = async () => {
  try {
    const token = localStorage.getItem('api_token')
    const res = await axios.post('/api/group/list',{}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    groups.value = res.data || []
  } catch (e) {
    console.error(e)
  }
}
/* HELPERS */
const getUserPhoto = (photo) =>
  photo
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${photo}`
    : '/default_person.png'

const weekdayName = (date) => {
  const names = ['Du','Se','Cho','Pa','Ju','Sha','Ya']
  const d = new Date(date)
  const i = d.getDay() === 0 ? 6 : d.getDay() - 1
  return names[i]
}
const fetchAuthUser = async () => {
  try {
    const token = localStorage.getItem('api_token')
    const res = await axios.get('/api/user/auth/get', {
      headers: { Authorization: `Bearer ${token}` }
    })
    authUser.value = res.data
  } catch (e) {
    console.error(e)
  }
}
const isSunday = (date) => new Date(date).getDay() === 0
const loadImageAsBase64 = (url) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = url
  })
}
/* INIT */
onMounted(() => {
  fetchAuthUser()
  loadGroups()
  loadStudents()
})

</script>

<style>
/* number arrow olib tashlash */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.rank-medal {
  width: 50px;           /* doira diametri */
  height: 50px;
  border-radius: 50%;    /* to'liq aylana */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 2rem;
  color: white;
  position: relative;
  box-shadow: 0 0 15px rgba(0,0,0,0.3);
  overflow: hidden;
}

.rank-other {
  background: #e5e7eb; /* gray-200 */
  color: #374151; /* gray-700 */
}
</style>
