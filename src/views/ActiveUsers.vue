<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 py-10 px-6 flex flex-col items-center space-y-10"
  >
    <!-- 🌿 Active Users Section -->
    <transition name="fade-slide">
      <div v-if="activeUsers" class="w-full max-w-5xl">
        <h2
          class="text-2xl font-bold text-green-700 mb-5 text-center flex items-center justify-center gap-2"
        >
          🌟 Faol obunachilar ro‘yxati
        </h2>

        <!-- 🔍 Search Section -->
        <div class="relative w-full max-w-lg mt-5 mx-auto">
          <input
            v-model="search"
            @input="fetchActiveUsers"
            type="text"
            placeholder="🔍 Telegram ID orqali qidirish..."
            class="w-full rounded-2xl border border-green-300 bg-white/70 backdrop-blur-sm shadow-md py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
          />
        </div>

        <!-- 🧑‍💻 Active Users List -->
        <div v-if="activeUsers.length" class="grid sm:grid-cols-2 gap-5 mt-5">
          <div
            v-for="sub in activeUsers"
            :key="sub.id"
            class="bg-gradient-to-br from-white/90 via-green-50 to-green-100 border border-green-200 rounded-2xl shadow-lg hover:shadow-green-300/50 hover:scale-[1.02] transition-all duration-300 p-5"
          >
            <div class="mb-3">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                {{ sub.user.first_name }} {{ sub.user.last_name }}
              </h3>
              <p class="text-gray-600 text-sm">
                Telegram ID: <span class="font-medium">{{ sub.user.telegram_id }}</span>
              </p>
              <p class="text-gray-600 text-sm">
                Username: <span class="font-medium">@{{ sub.user.telegram_username }}</span>
              </p>
              <p class="text-gray-600 text-sm">
                Phone: <span class="font-medium">{{ sub.user.phone }}</span>
              </p>
            </div>

            <div class="bg-white/70 border border-green-100 rounded-xl p-3 mb-4 shadow-inner">
              <p class="text-sm text-gray-700">
                💰 <strong>To‘langan:</strong> {{ sub.paid_amount }} / {{ sub.total_amount }}
              </p>
              <p class="text-sm text-gray-700">
                📅 <strong>Boshlangan:</strong> {{ formatDate(sub.started_at) }}
              </p>
              <p class="text-sm text-gray-700">
                ⏳ <strong>Tugaydi:</strong> {{ formatDate(sub.expires_at) }}
              </p>
            </div>

            <!-- <button
              @click="goToUser(sub.user.id)"
              :key="sub.user.id"
              class="w-full py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-green-400/50 hover:scale-105 transition-all duration-300"
            >
               Obunalar tarixi
            </button> -->
          </div>
        </div>

        <div v-else class="text-gray-500 italic text-center mt-10">
          ✅ Hozircha faol obunachilar yo‘q.
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";
import dayjs from "dayjs";

const activeUsers = ref([]);
const search = ref("");
const token = ref(new URLSearchParams(window.location.search).get("token") || null);

const fetchActiveUsers = async () => {
  try {
    const { data } = await axios.post(
      "/api/lists/active/users/list",
      { telegram_id: search.value || null },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    activeUsers.value = data;
  } catch (error) {
    console.error("❌ Active obunachilarni olishda xatolik:", error);
  }
};
const goToUser = (id) => {
  router.push({
    name: "admin-user-detail",
    params: { id },
    query: { token: token.value },
  });
};
const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

onMounted(() => {
  fetchActiveUsers();
});
</script>

<style scoped>
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
