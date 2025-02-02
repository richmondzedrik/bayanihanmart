<script setup>
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/shared/Navbar.vue';
import NotificationToast from '@/components/shared/NotificationToast.vue';
import Footer from '@/components/shared/Footer.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow">
      <NotificationToast />
      <router-view></router-view>
    </main>
    <Footer />
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
