<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-10 px-6 flex flex-col items-center">
    <!-- Title -->
    <h1 class="text-3xl font-extrabold text-gray-800 mb-6">
      👤 Foydalanuvchi ma'lumotlari
    </h1>

    <div v-if="user" class="bg-white/80 backdrop-blur-lg border border-white/40 shadow-xl rounded-3xl p-8 w-full max-w-2xl">
      <!-- User Info -->
      <div class="mb-4">
        <p class="text-lg font-semibold text-gray-700">{{ user.first_name }} {{ user.last_name }}</p>
        <p class="text-gray-600 text-sm">User ID: {{ user.id }}</p>
        <p class="text-gray-600 text-sm">Telegram ID: {{ user.telegram_id }}</p>
        <p class="text-gray-600 text-sm">Username: @{{ user.telegram_username }}</p>
        <p class="text-gray-600 text-sm">Phone: {{ user.phone }}</p>

        <!-- Status Select -->
        <div class="mt-4">
          <select
            v-model="selectedStatus"
            @change="updateUserStatus"
            class="w-full rounded-2xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none bg-white/90 shadow-sm"
          >
            <option v-for="st in statuses" :key="st.id" :value="st.id">
              {{ st.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Accordion for Subscription -->
      <div class="mt-6">
        <!-- Add Subscription Accordion -->
        <button @click="openAdd = !openAdd" class="w-full text-left bg-indigo-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-indigo-600 transition-all">
          💎 Obuna qo‘shish
        </button>
        <div v-show="openAdd" class="mt-4 bg-white/90 rounded-xl p-4 border border-gray-300 shadow-sm">
          <div class="grid grid-cols-1 gap-4">
            <input
              v-model="form.total_amount"
              type="number"
              placeholder="Umumiy summa (total_amount)"
              class="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <input
              v-model="form.paid_amount"
              type="number"
              placeholder="To‘langan summa (paid_amount)"
              class="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <input
              v-model="form.partial_payment_requested_at"
              type="date"
              placeholder="Qisman to‘lov so‘ralgan sana (ixtiyoriy)"
              class="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <button
              @click="addSubscription"
              class="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:scale-105 shadow-md hover:shadow-indigo-400/50 transition-all duration-300"
            >
              ➕ Obuna qo‘shish
            </button>
          </div>
        </div>

        <!-- Subscriptions History Accordion -->
        <button @click="openHistory = !openHistory" class="w-full text-left bg-green-500 text-white py-2 px-4 rounded-xl font-semibold mt-4 hover:bg-green-600 transition-all">
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
              </div>
              <p class="text-sm">💰 <strong>To‘langan:</strong> {{ sub.paid_amount }} / {{ sub.total_amount }}</p>
              <p class="text-sm">📅 <strong>Boshlangan:</strong> {{ formatDate(sub.started_at) }}</p>
              <p class="text-sm">⏳ <strong>Tugagan:</strong> {{ formatDate(sub.expires_at) }}</p>
            </div>
          </div>
          <div v-else class="text-gray-500 italic">
            Hech qanday obuna topilmadi.
          </div>
        </div>

         <!-- Comments Section -->
        <button @click="openComments = !openComments" class="w-full text-left bg-yellow-500 text-white py-2 px-4 rounded-xl font-semibold mt-4 hover:bg-yellow-600 transition-all">
          💬 Commentlar
        </button>
        <div v-show="openComments" class="mt-4 bg-white/90 rounded-xl p-4 border border-gray-300 shadow-sm">
          <!-- Existing Comments -->
          <div v-if="comments.length" class="space-y-3 mb-4">
            <div v-for="com in comments" :key="com.id" class="p-3 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
              <p class="text-gray-700">{{ com.comment }}</p>
              <p class="text-xs text-gray-400">{{ com.custom_date ? formatDate(com.custom_date) : formatDate(com.created_at) }}</p>
            </div>
          </div>
          <div v-else class="text-gray-500 italic mb-4">Hech qanday comment topilmadi.</div>

          <!-- Add Comment -->
          <div class="grid grid-cols-1 gap-3">
            <textarea v-model="commentForm.comment" placeholder="Yangi comment..." class="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"></textarea>
            <input v-model="commentForm.custom_date" type="date" placeholder="Maxsus sana (ixtiyoriy)" class="rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"/>
            <button @click="addComment" class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-2 rounded-xl hover:scale-105 shadow-md hover:shadow-yellow-300/50 transition-all duration-300">
              ➕ Comment qo‘shish
            </button>
          </div>
        </div>
      </div>
    </div>

    

    <div v-else class="text-gray-500 italic mt-10">
      ⏳ Ma'lumot yuklanmoqda...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "@/plugins/axios"
import dayjs from "dayjs"

// Route va token olish
const route = useRoute()
const token = route.query.token
const id = route.params.id

// Reactive data
const user = ref(null)
const statuses = ref([])
const selectedStatus = ref(null)
const subscriptions = ref([])
const comments = ref([])

// Formlar
const form = ref({
  total_amount: "",
  paid_amount: "",
  partial_payment_requested_at: ""
})

const commentForm = ref({
  comment: "",
  custom_date: ""
})

// Accordion states
const openAdd = ref(false)
const openHistory = ref(false)
const openComments = ref(false)

// 🔹 Fetch user
const fetchUser = async () => {
  try {
    const { data } = await axios.get(`/api/user/get/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.value = data
    selectedStatus.value = data.status?.id || null
  } catch (error) {
    console.error("❌ Foydalanuvchini olishda xatolik:", error)
  }
}

// 🔹 Fetch statuses
const fetchStatuses = async () => {
  try {
    const { data } = await axios.get("/api/user_status/list", {
      headers: { Authorization: `Bearer ${token}` }
    })
    statuses.value = data
  } catch (error) {
    console.error("❌ Statuslarni olishda xatolik:", error)
  }
}

// 🔹 Fetch subscriptions
const fetchSubscriptions = async () => {
  try {
    const { data } = await axios.get(`/api/subscription/list/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    subscriptions.value = data
  } catch (error) {
    console.error("❌ Obunalar ro‘yxatini olishda xatolik:", error)
  }
}

// 🔹 Fetch comments
const fetchComments = async () => {
  try {
    const { data } = await axios.get(`/api/comment/list/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    comments.value = data
  } catch (error) {
    console.error("❌ Commentlarni olishda xatolik:", error)
  }
}

// 🔹 Update user status
const updateUserStatus = async () => {
  try {
    await axios.put(`/api/admin/user/update/${id}`, {
      status_id: selectedStatus.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    alert("✅ Status muvaffaqiyatli yangilandi!")
  } catch (error) {
    console.error("❌ Status yangilanishida xatolik:", error)
    alert("❌ Statusni yangilashda xatolik yuz berdi!")
  }
}

// 🔹 Add subscription
const addSubscription = async () => {
  try {
    const payload = {
      user_id: user.value.id,
      total_amount: form.value.total_amount,
      paid_amount: form.value.paid_amount
    }
    if (form.value.partial_payment_requested_at) {
      payload.partial_payment_requested_at = form.value.partial_payment_requested_at
    }
    await axios.post("/api/subscription/add", payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
    alert("✅ Obuna muvaffaqiyatli qo‘shildi!")
    form.value.total_amount = ""
    form.value.paid_amount = ""
    form.value.partial_payment_requested_at = ""
    fetchSubscriptions()
  } catch (error) {
    console.error("❌ Obuna qo‘shishda xatolik:", error)
    alert("❌ Obuna qo‘shishda xatolik yuz berdi!")
  }
}

// 🔹 Add comment
const addComment = async () => {
  if (!commentForm.value.comment.trim()) {
    return alert("❌ Comment bo‘sh bo‘lishi mumkin emas!")
  }
  try {
    const payload = {
      user_id: user.value.id,
      comment: commentForm.value.comment
    }
    if (commentForm.value.custom_date) {
      payload.custom_date = commentForm.value.custom_date
    }
    await axios.post("/api/comment/add", payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
    alert("✅ Comment muvaffaqiyatli qo‘shildi!")
    commentForm.value.comment = ""
    commentForm.value.custom_date = ""
    fetchComments()
  } catch (error) {
    console.error("❌ Comment qo‘shishda xatolik:", error)
    alert("❌ Comment qo‘shishda xatolik yuz berdi!")
  }
}

// 🔹 Format date
const formatDate = (date) => dayjs(date).format("YYYY-MM-DD")

// Mounted
onMounted(() => {
  fetchUser()
  fetchStatuses()
  fetchSubscriptions()
  fetchComments()
})
</script>

