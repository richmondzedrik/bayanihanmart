import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  const itemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0);
  });

  function addItem(product) {
    const existingItem = items.value.find(item => item.productId === product.productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({
        ...product,
        quantity: 1
      });
    }
  }

  function removeItem(productId) {
    const index = items.value.findIndex(item => item.productId === productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.productId === productId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        removeItem(productId);
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    loading,
    error,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
});
