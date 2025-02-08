<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <TransitionGroup name="notification">
      <div v-for="toast in toastStore.toasts" 
           :key="toast.id"
           :class="[
             'p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300',
             getTypeClasses(toast.type)
           ]">
        <div class="flex justify-between items-start">
          <div>
            <h3 v-if="toast.title" class="font-semibold">{{ toast.title }}</h3>
            <p class="text-sm">{{ toast.message }}</p>
          </div>
          <button @click="toastStore.removeToast(toast.id)" 
                  class="ml-4 text-current opacity-70 hover:opacity-100">
            ×
          </button>
        </div>
      </div>   
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toastNotification';

const toastStore = useToastStore();

const getTypeClasses = (type) => {
  return {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  }[type] || 'bg-gray-100 text-gray-800';
};
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 