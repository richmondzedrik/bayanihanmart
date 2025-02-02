<script setup>
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/shared/Navbar.vue';
import NotificationToast from '@/components/shared/NotificationToast.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <NotificationToast />
    <router-view></router-view>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
