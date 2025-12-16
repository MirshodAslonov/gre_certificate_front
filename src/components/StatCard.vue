<template>
  <div class="bg-white/80 p-6 rounded-2xl shadow hover:scale-105 transition">
    <p class="text-sm text-gray-500">{{ title }}</p>
    <p class="text-3xl font-bold mt-2" :class="`text-${color}-600`">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({ title:String, value:[String,Number], color:String })
</script>
