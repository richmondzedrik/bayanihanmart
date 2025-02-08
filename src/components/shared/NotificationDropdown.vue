<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button @click="isOpen = !isOpen" 
      class="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      
      <!-- Unread Badge -->
      <span v-if="notificationStore.unreadCount > 0"
        class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
        {{ notificationStore.unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div v-if="isOpen" 
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
      <div class="px-4 py-2 border-b border-gray-100">
        <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="notificationStore.notifications.length === 0" 
          class="px-4 py-6 text-center text-gray-500">
          No notifications
        </div>

        <div v-for="notification in notificationStore.notifications" 
          :key="notification.id"
          :class="['px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer',
                  !notification.read ? 'bg-indigo-50' : '']"
          @click="handleNotificationClick(notification)">
          <p class="text-sm text-gray-900">{{ notification.message }}</p>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatDate(notification.createdAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'vue-router';

const notificationStore = useNotificationStore();
const isOpen = ref(false);
const router = useRouter();

onMounted(() => {
  notificationStore.subscribeToNotifications();
});

onUnmounted(() => {
  notificationStore.clearNotifications();
});

const formatDate = (date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    notificationStore.markAsRead(notification.id);
  }
  
  if (notification.type === 'product' && notification.productId) {
    router.push(`/buyer/marketplace?product=${notification.productId}`);
  }
};
</script>
