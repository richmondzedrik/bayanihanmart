import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([]);

  const addNotification = (notification) => {
    const id = Date.now();
    notifications.value.push({
      id,
      title: notification.title || '',
      message: notification.message,
      type: notification.type || 'info', // 'success', 'error', 'info', 'warning'
      duration: notification.duration || 3000
    });

    // Auto remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 3000);
  };

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(notification => notification.id !== id);
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
}); 