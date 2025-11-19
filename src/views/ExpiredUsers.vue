<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-10 px-6 flex flex-col items-center space-y-10"
  >

    <!-- 🔥 Expired Users Section -->
    <transition name="fade-slide">
      <div v-if="expiredUsers" class="w-full max-w-5xl">
        <h2
          class="text-2xl font-bold text-red-600 mb-5 text-center flex items-center justify-center gap-2"
        >
          ⏰ Obunasi tugagan foydalanuvchilar
        </h2>

        <!-- 🔍 Search Section -->
    <div class="relative w-full text-center max-w-lg mt-5 mx-auto">
      <input
        v-model="search"
        @input="fetchExpiredUsers"
        type="text"
        placeholder="🔍 Telegram ID orqali qidirish..."
        class="w-full rounded-2xl border border-gray-300 bg-white/70 backdrop-blur-sm shadow-md py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
      />
    </div>

        <div v-if="expiredUsers.length" class="grid sm:grid-cols-2 gap-5 mt-5">
          <div
            v-for="sub in expiredUsers"
            :key="sub.id"
            class="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg hover:shadow-red-200 hover:scale-[1.02] transition-all duration-300 p-5"
          >
            <div class="mb-3">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ sub.user.first_name }} {{ sub.user.last_name }}
              </h3>
              <p class="text-gray-500 text-sm mb-1">
                Telegram ID: <span class="font-medium">{{ sub.user.telegram_id }}</span>
              </p>
              <p class="text-gray-500 text-sm">
                Username: <span class="font-medium">@{{ sub.user.telegram_username }}</span>
              </p>
              <p class="text-gray-500 text-sm">
                Phone: <span class="font-medium">{{ sub.user.phone }}</span>
              </p>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
              <p class="text-sm text-gray-600">
                💰 <strong>To‘langan:</strong> {{ sub.paid_amount }} / {{ sub.total_amount }}
              </p>
              <p class="text-sm text-gray-600">
                📅 <strong>Boshlangan:</strong> {{ formatDate(sub.started_at) }}
              </p>
              <p class="text-sm text-gray-600">
                ⏳ <strong>Tugagan:</strong> {{ formatDate(sub.expires_at) }}
              </p>
            </div>

            <button
              @click="removeUser(sub.user.id)"
              class="w-full py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-md hover:shadow-rose-400/50 hover:scale-105 transition-all duration-300"
            >
              ❌ Guruhdan chiqarish
            </button>
          </div>
        </div>

        <div v-else class="text-gray-500 italic text-center mt-10">
          ✅ Hozircha obunasi tugagan foydalanuvchilar yo‘q.
        </div>
      </div>
    </transition>

    </div>
   
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

const router = useRouter();
const expiredUsers = ref([]);
const search = ref("");
const token = ref(null);

const urlParams = new URLSearchParams(window.location.search);
token.value = urlParams.get("token");

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

const removeUser = async (id) => {
  if (!confirm("Foydalanuvchini guruhdan chiqarishni tasdiqlaysizmi?")) return;

  try {
    await axios.post(
      "/api/telegram_group/remove/user",
      { id },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );

    expiredUsers.value = expiredUsers.value.filter(
      (sub) => sub.user.id !== id
    );

    alert("✅ Foydalanuvchi muvaffaqiyatli chiqarildi!");
  } catch (error) {
    console.error("❌ Guruhdan chiqarishda xatolik:", error);
    alert("❌ Xatolik yuz berdi!");
  }
};

const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

onMounted(() => {
  fetchExpiredUsers();
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeInUp {
  animation: fadeInUp 0.7s ease-out;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
