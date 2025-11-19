<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-10 px-6 flex flex-col items-center space-y-10"
  >
    <!-- Title -->
    <h1 class="text-4xl font-extrabold text-gray-800 tracking-tight animate-fadeInUp">
      👥 Foydalanuvchilar
    </h1>

    <!-- 🔍 Search Section -->
    <div class="relative w-full max-w-lg mt-5">
      <input
        v-model="search"
        @input="fetchUsers"
        type="text"
        placeholder="🔍 Telegram ID orqali qidirish..."
        class="w-full rounded-2xl border border-gray-300 bg-white/70 backdrop-blur-sm shadow-md py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
      />
    </div>

    <!-- 👤 Users list -->
    <div v-if="users" class="grid gap-4 w-full max-w-4xl">
      <div
        v-for="user in users"
        :key="user.id"
        @click="goToUser(user.id)"
        class="cursor-pointer bg-white/80 border border-white/40 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-indigo-200 hover:scale-[1.02] transition-all duration-300 p-5 flex items-center justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800">
            {{ user.first_name }} {{ user.last_name }}
          </h3>
          <p class="text-gray-500 text-sm">id: {{ user.id }}</p>
          <p class="text-gray-500 text-sm">phone: {{ user.phone }}</p>
        </div>
        <div class="text-indigo-600 font-bold text-sm">
          {{ user.telegram_id }}
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500 italic mt-10">
      😕 Hech qanday foydalanuvchi topilmadi.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);
const search = ref("");
const token = ref(null);

const urlParams = new URLSearchParams(window.location.search);
token.value = urlParams.get("token");

const fetchUsers = async () => {
  try {
    const { data } = await axios.post(
      "/api/user/list",
      { telegram_id: search.value || null },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    users.value = data;
  } catch (error) {
    console.error("❌ Userlarni olishda xatolik:", error);
  }
};

const goToUser = (id) => {
  router.push({
    name: "admin-user-detail",
    params: { id },
    query: { token: token.value },
  });
};

onMounted(() => {
  fetchUsers();
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
