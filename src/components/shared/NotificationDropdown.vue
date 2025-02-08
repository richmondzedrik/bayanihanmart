<template>
  <div class="relative" ref="dropdownRef">
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const notificationStore = useNotificationStore();
const isOpen = ref(false);
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.user) {
    notificationStore.subscribeToNotifications();
  }
});

onUnmounted(() => {
  notificationStore.clearNotifications();
});

const formatDate = (date) => {
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
};

const handleNotificationClick = async (notification) => {
  try {
    if (!notification.read) {
      await notificationStore.markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'order_status' && notification.orderId) {
      const route = authStore.user?.role === 'seller' ? '/seller/orders' : '/buyer/orders';
      router.push(route);
    } else if (notification.type === 'order' && notification.orderId) {
      const route = authStore.user?.role === 'seller' ? '/seller/orders' : '/buyer/orders';
      router.push(route);
    }
    
    isOpen.value = false;
  } catch (error) {
    console.error('Error handling notification click:', error);
  }
};

// Add click outside handler
const dropdownRef = ref(null);

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};
</script>
