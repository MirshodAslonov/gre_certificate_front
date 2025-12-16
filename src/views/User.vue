<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center p-6">
    
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[150px] opacity-20 animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-400 rounded-full blur-[150px] opacity-20 animate-pulse-slow delay-1000"></div>
    </div>

    <!-- CARD -->
    <div class=" z-70 bg-white/70 backdrop-blur-3xl border border-white/0 shadow-2xl rounded-3xl p-8 w-full max-w-2xl  animate-fadeInUp">

      <!-- PHOTO -->
      <div class="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg mb-4">
        <img :src="photoUrl" class="w-full h-full object-cover" />

        <!-- Upload -->
        <label class="absolute bottom-1 right-2 bg-indigo-500 text-white p-1 rounded-full shadow cursor-pointer">
          <input type="file" class="hidden" @change="uploadPhoto">
          📷
        </label>
      </div>

      <!-- USER INFO -->
      <h1 class="text-2xl text-center font-bold text-gray-800">{{ user.first_name }} {{ user.last_name }}</h1>
      <p class="text-gray-600 text-center text-sm mb-3">{{ user.phone }}</p>

      <!-- ROLE -->
      <div class="text-center">
      <span class="inline-block bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 text-white px-4 py-1 rounded-full shadow mb-6">
        {{ user.role?.name }}
      </span>
    </div>

      <!-- ACTIONS -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <button @click="student_lesson" class="py-3 bg-gray-200 rounded-2xl shadow">📅 Jadval</button>
        <!-- <button class="py-3 bg-green-200 rounded-2xl shadow">💰 To‘lov</button> -->
      </div>

      <!-- SUBSCRIPTION -->
      <div class="mb-4">
        <button @click="openSub = !openSub" class="btn w-full text-left bg-indigo-500 text-white py-2 px-4  rounded-xl shadow hover:bg-indigo-600">
         💎 Obuna qo‘shish
        </button>

        <div v-show="openSub" class="p-4 mt-2 bg-white border rounded-xl">
          <input v-model="subscription.total" placeholder="Total" type="number" class="w-full mb-3 border rounded-xl px-4 py-2">
          <input v-model="subscription.paid" placeholder="Paid" type="number" class="w-full mb-3 border rounded-xl px-4 py-2">
          
            <label class="block text-gray-700 text-sm font-medium mb-1">Boshlangan sana</label>
            <input 
              type="date" 
              v-model="subscription.started_at" 
              class="w-full mb-3 border rounded-xl px-4 py-2"
            >
          <button @click="addSubscription" class="btn w-full py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all">
           ➕ Qo‘shish
          </button>
        </div>
      </div>

      <!-- Subscriptions History Accordion -->
        <button @click="openHistory = !openHistory" class="btn w-full text-left bg-green-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-600 transition-all">
          📦 Obunalar tarixi
        </button>
        <div v-show="openHistory" class="mt-4 bg-white/90 rounded-xl p-4 border border-gray-300 shadow-sm">
          <div v-if="subscriptions.length" class="grid gap-4">
            <div
              v-for="sub in subscriptions"
              :key="sub.id"
              :class="[
                'p-4 rounded-xl shadow-md border transition-all duration-300',
                Boolean(Number(sub.is_active))
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-emerald-300/40 hover:scale-105'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              ]"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-semibold text-lg">
                  {{ Boolean(Number(sub.is_active)) ? '🟢 Aktiv obuna' : '⚪ Tugagan obuna' }}
                </h3>
                <button
                  v-if="authuser.role?.name === 'admin'"
                    @click.stop="deleteSub(sub.id)"
                    class="p-1.5 rounded-full transition-all
                          bg-red-300
                          hover:text-white
                          shadow-md "
                  >
                ❌
              </button>
              </div>
              <p class="text-sm">
  💰 <strong>To‘langan:</strong> {{ formatAmount(sub.paid_amount) }} / {{ formatAmount(sub.total_amount) }}
</p>
              <p class="text-sm">📅 <strong>Boshlangan:</strong> {{ formatDate(sub.started_at) }}</p>
              <p class="text-sm">⏳ <strong>Tugagan:</strong> {{ formatDate(sub.expires_at) }}</p>
            </div>
          </div>
          <div v-else class="text-gray-500 italic">
            Hech qanday obuna topilmadi.
          </div>
        </div>

      <!-- COMMENTS -->
      <div>
        <button @click="openComments = !openComments" class="btn w-full text-left bg-yellow-500 text-white py-2 px-4 mt-4 rounded-xl shadow hover:bg-yellow-600 transition-all">
          💬 Commentlar
        </button>

        <div v-show="openComments" class="p-4 mt-2 bg-white border rounded-xl space-y-3">
          <div v-for="c in comments" :key="c.id" class="p-3 bg-gray-100 rounded-xl border">
            <p class="text-gray-800">{{ c.comment }}</p>
            <p class="text-gray-400 text-xs">{{ formatDate(c.created_at) }}</p>
          </div>

          <textarea v-model="newComment" placeholder="Yangi comment..." class="w-full border rounded-xl p-3"></textarea>

          <button @click="addComment" class="btn w-full py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all">
            ➕ Qo‘shish
          </button>
        </div>
      </div>

    </div>

  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/plugins/axios'
import { useRoute } from 'vue-router'
import dayjs from "dayjs"
import { useRouter } from 'vue-router'
const router = useRouter()

const route = useRoute()
const id = route.params.id
const token = localStorage.getItem("api_token")

const user = ref({})
const comments = ref([])
const newComment = ref("")
const openComments = ref(false)
const openHistory = ref(false)
const subscriptions = ref([])
const authuser = ref({})

const fetchSubscriptions = async () => {
  try {
    const { data } = await axios.get(`/api/admin/subscribe/list/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    subscriptions.value = data
  } catch (error) {
    console.error("❌ Obunalar ro‘yxatini olishda xatolik:", error)
  }
}
const fetchAuthUser = async () => {
  try {
    const { data } = await axios.get(`/api/user/auth/get`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    authuser.value = data
  } catch (error) {
    console.error("❌ Auth userni olishda xatolik:", error)
  }
}
const openSub = ref(false)
const subscription = ref({
  total: "",
  paid: "",
  started_at: dayjs().format("YYYY-MM-DD")
})
const student_lesson = () => {
  router.push({
    name: 'student_lesson',          
    query: { user_id: user.value.id }  
  })
}
const photoUrl = computed(() => {
  return user.value.photo
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.value.photo}`
    : "/default_person.png"
})

onMounted(() => {
  loadUser()
  fetchSubscriptions()
  fetchAuthUser()  
})

/* ===========================
      USER DATA LOAD
===========================*/
const loadUser = async () => {

  const { data } = await axios.get(`api/admin/user/get/${id}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  })

  user.value = data
  comments.value = data.comments
}

/* ===========================
       COMMENT ADD
===========================*/
const addComment = async () => {
  if (!newComment.value) return

  

  await axios.post("api/user_comment/add", {
    user_id: user.value.id,
    comment: newComment.value,
    custom_date: null
  }, {
    headers: { Authorization: `Bearer ${token}` ,Accept: 'application/json'}
  })

  newComment.value = ""
  loadUser()
}

const deleteSub = async (id) => {

  await axios.post("api/admin/subscribe/delete", {
    id: id,
  }, {
    headers: { Authorization: `Bearer ${token}` ,Accept: 'application/json'}
  })
  loadUser()
  fetchSubscriptions()
}

/* ===========================
       SUBSCRIPTION ADD
===========================*/
const addSubscription = async () => {

  await axios.post("api/admin/subscribe/add", {
    user_id: user.value.id,
    total_amount: subscription.value.total,
    paid_amount: subscription.value.paid,
    started_at: subscription.value.started_at
  }, {
    headers: { Authorization: `Bearer ${token}`,Accept: 'application/json' }
  })

  subscription.value.total = ""
  subscription.value.paid = ""
  subscription.value.started_at = dayjs().format("YYYY-MM-DD") // reset to today
  fetchSubscriptions()
}

/* ===========================
       PHOTO UPLOAD
===========================*/
const uploadPhoto = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const form = new FormData()
  form.append("id", user.value.id)
  form.append("photo", file)

  await axios.post("api/admin/user/bind/photo", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  })

  loadUser()
}

/* ===========================
        DATE FORMAT
===========================*/
const formatDate = (date) => dayjs(date).format("YYYY-MM-DD")
const formatAmount = (amount) => {
  if (!amount) return "0";
  // 300000 → 300 000
  return Number(amount).toLocaleString("uz-UZ", { maximumFractionDigits: 0 });
}
</script>
<style>
@keyframes pulse-slow {
  0% { opacity: .2; transform: scale(.95); }
  50% { opacity: .4; transform: scale(1.05); }
  100% { opacity: .2; transform: scale(.95); }
}
.animate-pulse-slow { animation: pulse-slow 6s infinite; }

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp { animation: fadeInUp 1s ease forwards; }
.btn {
  transition: all 0.25s ease;
  transform: translateZ(0);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}
</style>
