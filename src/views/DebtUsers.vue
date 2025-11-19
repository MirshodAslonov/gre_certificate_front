<template>
  <div
    class="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 py-10 px-6 flex flex-col items-center space-y-10"
  >
    <!-- 💰 Debt Users Section -->
    <transition name="fade-slide">
      <div v-if="debtUsers" class="w-full max-w-5xl">
        <h2
          class="text-2xl font-bold text-yellow-700 mb-5 text-center flex items-center justify-center gap-2"
        >
          ⚠️ Qarzdor foydalanuvchilar
        </h2>

        <!-- 🔍 Search Section -->
        <div class="relative w-full max-w-lg mt-5 mx-auto">
          <input
            v-model="search"
            @input="fetchDebtUsers"
            type="text"
            placeholder="🔍 Telegram ID orqali qidirish..."
            class="w-full rounded-2xl border border-yellow-300 bg-white/70 backdrop-blur-sm shadow-md py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
          />
        </div>

        <!-- 💳 Debt Users List -->
        <div v-if="debtUsers.length" class="grid sm:grid-cols-2 gap-5 mt-5">
          <div
            v-for="sub in debtUsers"
            :key="sub.id"
            class="bg-gradient-to-br from-white/90 via-yellow-50 to-amber-100 border border-yellow-200 rounded-2xl shadow-lg hover:shadow-yellow-300/50 hover:scale-[1.02] transition-all duration-300 p-5 relative"
          >
            <!-- 🟡 Debt Badge -->
            <span
              class="absolute top-2 right-2 bg-yellow-400 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
            >
              Qarzdor
            </span>

            <div class="mb-3">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
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

            <div class="bg-white/70 border border-yellow-100 rounded-xl p-3 mb-4 shadow-inner">
              <p class="text-sm text-gray-700">
                💰 <strong>To‘langan:</strong> {{ sub.paid_amount }} / {{ sub.total_amount }}
              </p>
              <p class="text-sm text-gray-700">
                📅 <strong>Boshlangan:</strong> {{ formatDate(sub.started_at) }}
              </p>
              <p class="text-sm text-gray-700">
                ⏳ <strong>Tugaydi:</strong> {{ formatDate(sub.expires_at) }}
              </p>
              <div
  class="mt-3 p-3 rounded-lg bg-gradient-to-r from-yellow-100 to-amber-200 border border-amber-300 shadow-md flex items-center gap-3"
>
  <div class="bg-amber-500 text-white w-9 h-9 flex items-center justify-center rounded-full shadow">
    ⏳
  </div>

  <div>
    <p class="text-sm text-gray-800 font-semibold">Eslatma sanasi</p>
    <p class="text-sm text-gray-700">
      {{ formatDate(sub.partial_payment_requested_at) }}
    </p>
  </div>
</div>
            </div>

            <button
            v-if="isReminderVisible(sub.partial_payment_requested_at)"
            @click="remindUser(sub.user.id)"
            class="w-full py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold shadow-md hover:shadow-yellow-400/50 hover:scale-105 transition-all duration-300"
          >
            🔔 Eslatma yuborish
          </button>
          </div>
        </div>

        <div v-else class="text-gray-500 italic text-center mt-10">
          ✅ Hozircha qarzdor foydalanuvchilar yo‘q.
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";
import dayjs from "dayjs";

const debtUsers = ref([]);
const search = ref("");
const token = ref(new URLSearchParams(window.location.search).get("token") || null);

const fetchDebtUsers = async () => {
  try {
    const { data } = await axios.post(
      "/api/lists/debtor/users/list",
      { telegram_id: search.value || null },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    debtUsers.value = data;
  } catch (error) {
    console.error("❌ Qarzdor foydalanuvchilarni olishda xatolik:", error);
  }
};

const remindUser = async (id) => {
  if (!confirm("Foydalanuvchiga to‘lov eslatmasi yuborilsinmi?")) return;

  try {
    await axios.post(
      "/api/telegram_group/remind/payment",
      { id },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );

    alert("✅ To‘lov eslatmasi yuborildi!");
  } catch (error) {
    console.error("❌ Eslatma yuborishda xatolik:", error);
    alert("❌ Xatolik yuz berdi!");
  }
};

const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

onMounted(() => {
  fetchDebtUsers();
});

const isReminderVisible = (date) => {
  if (!date) return false;

  const today = dayjs().startOf("day");
  const requestDate = dayjs(date).startOf("day");

  return requestDate.isBefore(today) || requestDate.isSame(today);
};
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
