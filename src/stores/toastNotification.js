import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);

  const addToast = (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      ...toast,
      duration: toast.duration || 5000
    };
    
    toasts.value.push(newToast);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  return {
    toasts,
    addToast,
    removeToast
  };
});
