<template>
  
  <div class="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden w-full">

    <!-- BACKGROUND -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-400/30 blur-[160px] rounded-full animate-pulse"></div>
      <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-400/30 blur-[160px] rounded-full animate-pulse delay-1000"></div>
    </div>

    <!-- HERO -->
    <section class="relative z-10 pt-24 pb-10 text-center w-full">
      <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
        Aslonov <span class="text-indigo-600">Zamonaviy Ta'lim</span>
      </h1>
     <p class="mt-6 text-lg text-gray-600 w-full md:max-w-none">
      Farzandingizni Prezident, Al-Xorazmiy va ixtisoslashgan maktablarga 
      matematikadan tizimli tayyorlash — ota-ona uchun to‘liq nazorat bilan.
    </p>
    </section>

   <section class="relative z-10 py-20 w-full">
  <h2 class="text-3xl font-bold mb-8 text-center">Rank</h2>

  <div class="flex gap-6 overflow-x-auto scrollbar-hide px-6">

    <div
      v-for="(user, index) in rankers"
      :key="user.id"
      class="min-w-[260px] bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition text-center"
    >
      <img
        :src="user.photo"
        class="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-indigo-500"
      />

      <h3 class="font-bold text-lg">
        {{ user.fullName }}
      </h3>

      <p class="text-sm text-gray-600 mt-2">
        🧠 {{ user.totalProblems ?? 0}} rank
      </p>

    </div>

  </div>
</section>
     <!-- Vazirlik -->
    <section class="relative z-10 py-14 bg-white/40 backdrop-blur-xl w-full overflow-hidden">
  <h2 class="text-3xl font-bold text-center mb-8">
    Bizning Yosh Vazirligimiz
  </h2>

      <div
  class="relative w-full overflow-hidden marquee-mask"
  :style="{ '--marquee-duration': marqueeDuration }"
>
  <div class="marquee-track">
    <div
  v-for="(item, i) in ministers"
  :key="'a-'+i"
  class="marquee-item-wrapper"
>
 <!-- Rank -->
  <div class="marquee-item mb-1">
    <img :src="item.url" />
  </div>
  <span class="relative inline-flex items-center
           bg-gradient-to-r from-amber-400 via-orange-400 to-red-500
           text-white px-5 py-0 rounded-full shadow group">
   {{ item.rank_name }}
  </span>
  <!-- <span class="name">{{ item.fullName }}</span> -->
</div>

<!-- nusxa -->
<div
  v-for="(item, i) in ministers"
  :key="'b-'+i"
  class="marquee-item-wrapper"
>
  <div class="marquee-item mb-1">
    <img :src="item.url" />
  </div>
   <span class="relative inline-flex items-center
           bg-gradient-to-r from-amber-400 via-orange-400 to-red-500
           text-white px-5 py-0 rounded-full shadow group">
   {{ item.rank_name }}
  </span>
  <!-- <span class="name">{{ item.fullName }}</span> -->
</div>

<div
  v-for="(item, i) in ministers"
  :key="'b-'+i"
  class="marquee-item-wrapper"
>
  <div class="marquee-item mb-1">
    <img :src="item.url" />
  </div>
   <span class="relative inline-flex items-center
           bg-gradient-to-r from-amber-400 via-orange-400 to-red-500
           text-white px-5 py-0 rounded-full shadow group">
   {{ item.rank_name }}
  </span>
  <!-- <span class="name">{{ item.fullName }}</span> -->
</div>

<div
  v-for="(item, i) in ministers"
  :key="'b-'+i"
  class="marquee-item-wrapper"
>
  <div class="marquee-item mb-1">
    <img :src="item.url" />
  </div>
   <span class="relative inline-flex items-center
           bg-gradient-to-r from-amber-400 via-orange-400 to-red-500
           text-white px-5 py-0 rounded-full shadow group">
   {{ item.rank_name }}
  </span>
  <!-- <span class="name">{{ item.fullName }}</span> -->
</div>

<div
  v-for="(item, i) in ministers"
  :key="'b-'+i"
  class="marquee-item-wrapper"
>
  <div class="marquee-item mb-1">
    <img :src="item.url" />
  </div>
   <span class="relative inline-flex items-center
           bg-gradient-to-r from-amber-400 via-orange-400 to-red-500
           text-white px-5 py-0 rounded-full shadow group">
   {{ item.rank_name }}
  </span>
  <!-- <span class="name">{{ item.fullName }}</span> -->
</div>
    
<div
  v-for="(item, i) in ministers"
  :key="'b-'+i"
  class="marquee-item-wrapper"
>
  <div class="marquee-item mb-1">
    <img :src="item.url" />
  </div>
   <span class="relative inline-flex items-center
           bg-gradient-to-r from-amber-400 via-orange-400 to-red-500
           text-white px-5 py-0 rounded-full shadow group">
   {{ item.rank_name }}
  </span>
  <!-- <span class="name">{{ item.fullName }}</span> -->
</div>
  </div>
</div>



</section>

    <!-- DARS -->
    <!-- <section class="relative z-10 py-20 w-full">
      <h2 class="text-3xl font-bold mb-8 text-center">Dars Jarayoni</h2>
      <div class="flex gap-6 overflow-x-auto scrollbar-hide px-6">
        <div v-for="i in 6" :key="i"
          class="min-w-[260px] bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition">
          <img src="/akom.png" class="rounded-2xl mb-4" />
          <h3 class="font-bold text-lg">Zamonaviy Dars</h3>
          <p class="text-sm text-gray-600 mt-2">
            Interaktiv va amaliy mashg‘ulotlar
          </p>
        </div>
      </div>
    </section> -->

    <!-- VIDEO -->
    <section class="relative z-10 py-20 bg-gradient-to-r from-indigo-50 to-purple-50 w-full">
  <h2 class="text-3xl font-bold mb-8 text-center">Matematika Club</h2>

  <div class="flex gap-6 overflow-x-auto scrollbar-hide px-7">
    
    <!-- 1-video -->
    <div class="min-w-[360px] bg-black rounded-3xl overflow-hidden shadow-xl">
      <div class="w-full h-[210px]">
        <iframe
          class="w-full h-full"
          src="https://www.youtube.com/embed/rOUt4258-2I"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>

      <div class="p-4 bg-white">
        <h4 class="font-semibold text-center">
          Matematika Club dagilar
        </h4>
      </div>
    </div>
  </div>
</section>


    <!-- KITOB -->
    <section class="relative z-10 py-10 w-full">
      <h2 class="text-3xl font-bold mb-1 text-center">Adabiyotlar</h2>
      <div class="flex gap-6 overflow-x-auto scrollbar px-5 py-4">
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/idc11.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">IDC 1-qism Matematika</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/idc12.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">IDC 2-qism Matematika</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/idc13.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">IDC 3-qism Matematika</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/daraja1.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">IDC 1-qism Daraja</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/daraja2.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">IDC 2-qism Daraja</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/daraja3.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">IDC 3-qism Daraja</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/idc1.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">IDC 1-qism Yosh Iqtidor</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/idc2.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">IDC 2-qism Yosh Iqtidor</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/idc3.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">IDC 3-qism Yosh Iqtidor</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/idc4.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">Testlar To'plami Yosh Iqtidor</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/idc5.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">Muammoli Masalalar To'plami</p>
        </div>
        <div
          class="min-w-[270px] bg-white rounded-3xl shadow-lg p-4 text-center">
          <img src="/idc6.png" class="h-80 mx-auto mb-3" />
          <p class="font-semibold">Tanqidiy Fikrlash</p>
        </div>
      </div>
    </section>

      <!-- FOOTER CTA -->
    <section class="relative z-10 py-20 text-center w-full">
      <h2 class="text-4xl font-extrabold mb-6">
        Farzandingiz kelajagini bugun boshlang
      </h2>
      <button @click="goToLogin"
        class="px-12 py-4 rounded-full text-lg font-bold text-white
        bg-gradient-to-r from-pink-500 to-indigo-500 shadow-xl hover:scale-105 transition">
        🚀 Kirish
      </button>
    </section>



<section class="relative z-10 py-20 bg-gradient-to-r from-indigo-50 to-purple-50 w-full">
  <h2 class="text-3xl font-bold mb-10 text-center">Manzilimiz</h2>

  <div class="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-8 items-center">
    
    <!-- 🎬 Video -->
    <div class="w-full h-[250px] md:h-[350px] rounded-3xl overflow-hidden shadow-xl">
      <iframe
        class="w-full h-full"
        src="https://www.youtube.com/embed/5FB08VYbtdo"
        frameborder="0"
        allowfullscreen>
      </iframe>
    </div>

    <!-- 🖼️ Rasmlar -->
   <div class="grid grid-cols-2 gap-4">
      <img src="/joy1.jpg" @click="openImage('/joy1.jpg')" class="cursor-pointer rounded-2xl shadow-md hover:scale-105 transition duration-300">
      <img src="/joy2.jpg" @click="openImage('/joy2.jpg')" class="cursor-pointer rounded-2xl shadow-md hover:scale-105 transition duration-300">
      <img src="/joy3.jpg" @click="openImage('/joy3.jpg')" class="cursor-pointer rounded-2xl shadow-md hover:scale-105 transition duration-300">
      <img src="/joy4.jpg" @click="openImage('/joy4.jpg')" class="cursor-pointer rounded-2xl shadow-md hover:scale-105 transition duration-300">
  </div>

  </div>
</section>
<div
  v-if="lightboxOpen"
  @click="lightboxOpen = false"
  class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
>
  <img :src="selectedImage" class="max-w-[90%] max-h-[90%] rounded-xl shadow-lg">
</div>


    <!-- MANZIL (ENG OXIRI) -->
    <section class="relative z-0 py-10 bg-indigo-100/70 backdrop-blur-xl text-center w-full">
  <!-- Map -->
  <iframe
    class="w-full h-96 md:h-[500px] lg:h-[600px] rounded-3xl shadow-xl border-0"
    src="https://www.google.com/maps?q=41.276206,69.373473&hl=uz&z=13&output=embed"
    allowfullscreen
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade">
  </iframe>

  <!-- Phone -->
  <p class="font-semibold text-indigo-600 mt-2">
    📞 +998 99 009 79 29
  </p>

  <!-- Social buttons -->
  <div class="mt-6 flex justify-center gap-4 flex-wrap">
    <!-- Telegram -->
    <!-- <a
      href="https://t.me/aslonovschool"
      target="_blank"
      class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg transition"
    >
      
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.993 15.674 9.87 19.4c.435 0 .623-.188.85-.413l2.04-1.954 4.232 3.095c.776.428 1.326.203 1.518-.72l2.753-12.93c.262-1.12-.404-1.558-1.16-1.27L2.19 9.422c-1.09.43-1.073 1.04-.197 1.31l4.59 1.43 10.65-6.72c.5-.33.96-.15.58.18z"/>
      </svg>
      Telegram
    </a> -->

    <!-- YouTube -->
    <a
      href="https://www.youtube.com/@aslonovschool"
      target="_blank"
      class="flex items-left gap-2 px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg transition"
    >
      <!-- YouTube icon -->
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a2.958 2.958 0 0 0-2.08-2.093C19.582 3.5 12 3.5 12 3.5s-7.582 0-9.418.593A2.958 2.958 0 0 0 .502 6.186 31.17 31.17 0 0 0 0 12a31.17 31.17 0 0 0 .502 5.814 2.958 2.958 0 0 0 2.08 2.093C4.418 20.5 12 20.5 12 20.5s7.582 0 9.418-.593a2.958 2.958 0 0 0 2.08-2.093A31.17 31.17 0 0 0 24 12a31.17 31.17 0 0 0-.502-5.814zM9.545 15.568V8.432L15.818 12z"/>
      </svg>
      YouTube
    </a>
  </div>
</section>


    <!-- FLOATING CTA -->
   <a
  href="tel:+998990097929"
  class="fixed bottom-3 right-1 z-50
  px-6 py-4 rounded-full font-bold text-white
  bg-gradient-to-r from-indigo-500 to-purple-500
  shadow-2xl animate-ring hover:scale-110 transition"
>
  📞 Bog‘lanish
</a>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from "vue-router"
import axios from '@/plugins/axios'


 const lightboxOpen = ref(false)
const selectedImage = ref(null)

const openImage = (src) => {
  selectedImage.value = src
  lightboxOpen.value = true
}

const token = localStorage.getItem("api_token")
const router = useRouter()

const goToLogin = () => router.push({ name: "login" })
const goToRegisterWithoutPassword = async () => {
  const token = localStorage.getItem('api_token')
  if (token) {
    try {
      const res = await axios.get('/api/user/auth/get', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const user = res.data
      if (user.role_id === 1) {
        router.push({ name: 'admin_home' })
      } else {
        router.push({ name: 'home' })
      }
    } catch (error) {
      console.error('Token invalid or expired')
      localStorage.removeItem('api_token')
      router.push({ name: "registerWithoutPassword" })
    }
  } else {
    router.push({ name: "registerWithoutPassword" })
  }
}
const MIN_DURATION = 40   // eng sekin (limit)
const PER_ITEM = 3        // har rasm uchun vaqt

const ministers = ref([
  { url: '/aslonov_icon.png', fullName: 'Default User 1' },
  { url: '/aslonov_icon.png', fullName: 'Default User 2' },
  { url: '/aslonov_icon.png', fullName: 'Default User 3' }
])
const rankers = ref([])

const fetchRankers = async () => {
  try {
    const response = await axios.get('/api/user/list/ranker_with_problem_stat')
    const users = Array.isArray(response.data)
      ? response.data
      : response.data?.data ?? []

    // agar total_problems null bo'lsa 0 qilamiz
    const mappedUsers = users.map(u => ({
      id: u.id,
      fullName: `${u.first_name} ${u.last_name}`,
      totalProblems: Number(u.total_problems) || 0,
      photo: u.photo
        ? `${import.meta.env.VITE_API_BASE_URL}/storage/${u.photo}`
        : '/default_person.png'
    }))

    // duplicatelarni olib tashlash (id bo'yicha)
    const uniqueUsers = mappedUsers.filter(
      (v,i,a) => a.findIndex(u => u.id === v.id) === i
    )

    // faqat eng ko'p problem ishlagan 6 ta
    rankers.value = uniqueUsers.sort((a,b) => b.totalProblems - a.totalProblems).slice(0,500)

  } catch (e) {
    console.error(e)
  }
}


onMounted(() => {
  fetchRankers()
  fetchMinisters()
})
const fetchMinisters = async () => {
  try {
    const response = await axios.get('/api/user/list/ranker', {
      headers: { }
    })

    const users = Array.isArray(response.data)
      ? response.data
      : response.data?.data ?? []

     if (users.length > 0) {
      ministers.value = users.map(u => ({
        url: u.photo
          ? `${import.meta.env.VITE_API_BASE_URL}/storage/${u.photo}`
          : '/default_person.png',
        fullName: `${u.first_name} ${u.last_name}`,
        rank_name: u.rank?.name || null  // rank bo'lmasa null
      }))
    }

  } catch (e) {
    console.error(e)
  }
}


const marqueeDuration = computed(() => {
  return Math.max(ministers.value.length * PER_ITEM, MIN_DURATION) + 's'
})
</script>
<style scoped>

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee var(--marquee-duration) linear infinite;
}


.marquee-item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 3rem;
  flex-shrink: 0;
}

.marquee-item {
  width: 8rem;
  height: 8rem;
  border-radius: 9999px;
  overflow: hidden;
  border: 4px solid #6366f1;
  box-shadow: 0 12px 30px rgba(0,0,0,.2);
}

.marquee-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4f46e5;
  text-align: center;
  white-space: nowrap;
}

/* animatsiya */
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* yon tomondan fade */
.marquee-mask {
  overflow: hidden;
  mask-image: none;
  -webkit-mask-image: none;
}

@keyframes ring {
  0%   { transform: scale(1) rotate(0deg); }
  2%   { transform: scale(1.05) rotate(2deg); }
  4%   { transform: scale(1.05) rotate(-2deg); }
  6%   { transform: scale(1.05) rotate(2deg); }
  8%   { transform: scale(1) rotate(0deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes pulse-ring {
  0% {
    box-shadow:
      0 0 0 0 rgba(99,102,241,0.6),
      0 0 0 10px rgba(99,102,241,0.3),
      0 0 0 20px rgba(99,102,241,0.15);
  }
  100% {
    box-shadow:
      0 0 0 10px rgba(99,102,241,0),
      0 0 0 30px rgba(99,102,241,0),
      0 0 0 60px rgba(99,102,241,0);
  }
}

.animate-ring {
  animation:
    ring 3s ease-in-out infinite,
    pulse-ring 1s ease-out infinite;
}

</style>