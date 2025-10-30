<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <router-view />
</template>

<style scoped>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

header {
  margin: 0;
  padding: 0;
}

.logo {
  margin: 0;
}

.wrapper {
  margin: 0;
  padding: 0;
}
</style>
