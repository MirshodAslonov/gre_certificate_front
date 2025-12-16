<template>
  <div class="p-6 space-y-6">
    <!-- ==================== GROUP INFO CARD ==================== -->
<div class="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex flex-col space-y-4">
  <!-- Header: Group Name + Edit Button -->
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold">{{ group.name || '...' }}</h2>
    <button
      @click="openLessonEdit"
      class="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700"
    >
      ✏️ Dars vaqtini tahrirlash
    </button>
  </div>

  <!-- Group Details -->
  <div class="space-y-2">
    <p class="text-gray-700">{{ group.description || 'Tavsif mavjud emas' }}</p>

    <p class="font-medium">
      🗓 Kunlar:
      <span class="text-indigo-600 font-semibold">
        {{ formatWeekDays(group.week_days) }}
      </span>
    </p>

    <p class="font-medium">
      ⏰ Vaqti:
      <span class="text-indigo-600 font-semibold">
        {{ formatTime(group.start_time) || '--:--' }} - {{ formatTime(group.end_time) || '--:--' }}
      </span>
    </p>
  </div>
</div>

<!-- ADD USER BUTTON -->
<div class="flex justify-end mb-4">
  <button
    @click="openAddUserModal"
    class="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
  >
    ➕ User qo‘shish
  </button>
</div>

<!-- ADD USER MODAL -->
<div
  v-if="showAddUserModal"
  class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto"
>
  <div class="bg-white p-6 rounded-2xl w-3/4 max-w-5xl shadow-xl relative">
    <h3 class="text-2xl font-bold mb-4">Guruhga user qo‘shish</h3>

    <!-- SEARCH -->
    <div class="mb-4">
      <input
        v-model="userSearch"
        @input="fetchUserList"
        type="text"
        placeholder="Search..."
        class="input-field w-full"
      />
    </div>

    <!-- USERS TABLE -->
    <div class="overflow-y-auto max-h-[60vh]">
      <table class="min-w-full text-left border rounded-xl">
        <thead class="bg-indigo-100">
          <tr>
            <th class="px-4 py-2">Foto</th>
            <th class="px-4 py-2">Ism</th>
            <th class="px-4 py-2">Familiya</th>
            <th class="px-4 py-2">Telefon</th>
            <th class="px-4 py-2">Amal</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in userList"
            :key="u.id"
            class="border-b hover:bg-indigo-50/30 transition"
          >
            <td class="px-4 py-2">
              <img
                v-if="u.photo"
                :src="getUserListPhoto(u)"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div
                v-else
                class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300"
              >
                N/A
              </div>
            </td>
            <td class="px-4 py-2">{{ u.first_name }}</td>
            <td class="px-4 py-2">{{ u.last_name }}</td>
            <td class="px-4 py-2">{{ u.phone }}</td>
            <td class="px-4 py-2">
              <button
                @click="bindUserToGroup(u.id)"
                class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Tanlash
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button
      @click="closeAddUserModal"
      class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
    >
      ✖
    </button>
  </div>
</div>

    <!-- ==================== USERS TABLE ==================== -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">Guruhdagi o‘quvchilar</h3>
      </div>

      <table
        class="min-w-full bg-white/70 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden text-left"
      >
        <thead class="bg-indigo-100/50">
          <tr>
            <th class="px-4 py-2 w-12">ID</th>
            <th class="px-4 py-2 w-16">Foto</th>
            <th class="px-4 py-2">Ism</th>
            <th class="px-4 py-2">Familiya</th>
            <th class="px-4 py-2">Telefon</th>
            <th class="px-4 py-2">Amallar</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in groupUsers"
            :key="item.id"
            class="border-b hover:bg-indigo-50/40 transition"
          >
            <td class="px-4 py-2">{{ item.user.id }}</td>

            <td class="px-4 py-2">
              <img
                v-if="item.user.photo"
                :src="getUserPhoto(item)"
                class="w-10 h-10 rounded-full object-cover cursor-pointer"
                @click="openImageModal(getUserPhoto(item))"
              />
              <div
                v-else
                class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300"
              >
                N/A
              </div>
            </td>

            <td class="px-4 py-2">{{ item.user.first_name }}</td>
            <td class="px-4 py-2">{{ item.user.last_name }}</td>
            <td class="px-4 py-2">{{ item.user.phone }}</td>

            <td class="px-4 py-2">
              <button
                @click="removeUser(item.user.id)"
                class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                O‘chirish
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ==================== IMAGE MODAL ==================== -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      @click="closeImageModal"
    >
      <img
        :src="selectedImage"
        class="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
      />
    </div>

    <!-- ==================== LESSON TIME EDIT MODAL ==================== -->
    <div
      v-if="showLessonModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-96 shadow-xl">
        <h3 class="text-lg font-bold mb-4">
          Dars vaqtini tahrirlash
        </h3>

        <label class="font-medium">Kunlar:</label>
        <div class="grid grid-cols-3 gap-2 my-2">
          <button
            v-for="d in weekButtons"
            :key="d.id"
            @click="toggleWeekday(d.id)"
            :class="[
              'px-3 py-1 rounded-xl text-sm font-semibold',
              lessonForm.week_days.includes(d.id)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ d.name }}
          </button>
        </div>

        <label class="font-medium">Boshlanish vaqti:</label>
<input
  v-model="lessonForm.start_time"
  type="text"
  placeholder="HH:MM"
  class="input-field mb-2"
  @input="validateTime('start_time')"
/>

<label class="font-medium">Tugash vaqti:</label>
<input
  v-model="lessonForm.end_time"
  type="text"
  placeholder="HH:MM"
  class="input-field mb-4"
  @input="validateTime('end_time')"
/>

        <div class="flex justify-end gap-2">
          <button @click="closeLessonEdit" class="btn-cancel">Bekor</button>
          <button @click="saveLesson" class="btn-primary">Saqlash</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/plugins/axios'

const route = useRoute()
const groupId = route.params.id

const group = ref({})
const groupUsers = ref([])
const showImageModal = ref(false)
const selectedImage = ref('')

// Lesson modal
const showLessonModal = ref(false)
const lessonForm = ref({
  id: groupId,
  week_days: [],
  start_time: '',
  end_time: ''
})
function formatTime(time) {
  if (!time) return ''
  // faqat soat va minutni olamiz
  return time.slice(0,5)
}
const weekNames = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
const weekButtons = [
  { id: 1, name: 'Du' }, { id: 2, name: 'Se' }, { id: 3, name: 'Ch' },
  { id: 4, name: 'Pa' }, { id: 5, name: 'Ju' }, { id: 6, name: 'Sh' }, { id: 7, name: 'Ya' }
]

// ======================= LOAD DATA =======================
async function loadGroup() {
  const token = localStorage.getItem('api_token')
  const { data } = await axios.get(`/api/admin/group/get/${groupId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  group.value = data
  groupUsers.value = data.users || []

  lessonForm.value.week_days = data.week_days || []
 lessonForm.value.start_time = data.start_time ? data.start_time.split(':').slice(0,2).join(':') : ''
lessonForm.value.end_time   = data.end_time   ? data.end_time.split(':').slice(0,2).join(':')   : ''

}

// ======================= UTILS =======================
function formatWeekDays(list) {
  if (!list || !Array.isArray(list)) return ''
  return list
    .slice()            // asl arrayni o'zgartirmaslik uchun
    .sort((a, b) => a - b)  // o'sish tartibi
    .map(i => weekNames[i - 1])
    .join(', ')
}
function getUserPhoto(u) {
  return u.user.photo
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${u.user.photo}`
    : '/default_person.png'
}
function getUserListPhoto(u) {
  return u.photo
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${u.photo}`
    : '/default_person.png'
}
// ======================= USER ACTIONS =======================
async function removeUser(userId) {
  const token = localStorage.getItem('api_token')
  await axios.post(`/api/admin/group_user/remove/group`, { group_id: groupId, user_id: userId }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  loadGroup()
}

// ======================= LESSON EDIT MODAL =======================
function openLessonEdit() { showLessonModal.value = true }
function closeLessonEdit() { showLessonModal.value = false }

function toggleWeekday(day) {
  const arr = lessonForm.value.week_days
  if (arr.includes(day)) {
    lessonForm.value.week_days = arr.filter(i => i !== day)
  } else {
    lessonForm.value.week_days.push(day)
  }
}

async function saveLesson() {

  const token = localStorage.getItem('api_token')
  await axios.put('/api/admin/group/update_lesson/time', lessonForm.value, {
    headers: { Authorization: `Bearer ${token}` }
  })
  showLessonModal.value = false
  loadGroup()
}


// ======================= IMAGE MODAL =======================
function openImageModal(url) { selectedImage.value = url; showImageModal.value = true }
function closeImageModal() { showImageModal.value = false }

onMounted(() => loadGroup())


function validateTime(field) {
  const time = lessonForm.value[field]
  // HH:MM formatni qabul qilamiz
  const regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/
  return regex.test(time)
}

// ADD USER MODAL
const showAddUserModal = ref(false)
const userList = ref([])
const userSearch = ref('')

// ================= OPEN/CLOSE MODAL =================
function openAddUserModal() {
  showAddUserModal.value = true
  fetchUserList()
}
function closeAddUserModal() {
  showAddUserModal.value = false
}

// ================= FETCH USERS =================
async function fetchUserList() {
  const token = localStorage.getItem('api_token')
  try {
    const { data } = await axios.post('/api/admin/user/list', {
      search: userSearch.value || null
    }, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
    userList.value = data
  } catch (err) {
    console.error(err)
  }
}


// ================= BIND USER TO GROUP =================
async function bindUserToGroup(userId) {
  const token = localStorage.getItem('api_token')
  try {
    await axios.post('/api/admin/group_user/bind/group', {
      user_id: userId,
      group_id: groupId
    }, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
    alert('User guruhga qo‘shildi!')
    closeAddUserModal()
    loadGroup()
  } catch (err) {
    console.error(err)
  }
 }
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.btn-primary {
  background: linear-gradient(90deg,#6366f1,#8b5cf6);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
}
.btn-cancel {
  background: #ccc;
  padding: 6px 12px;
  border-radius: 8px;
}
</style>
