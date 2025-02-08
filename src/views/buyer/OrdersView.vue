<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Orders</h1>
      <p class="mt-2 text-gray-600">Track and manage your orders</p>
    </div>

    <!-- Loading State -->
    <div v-if="orderStore.loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="orderStore.error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      {{ orderStore.error }}
    </div>

    <!-- Orders List -->
    <div v-else class="grid grid-cols-1 gap-6">
      <div v-for="order in orderStore.orders" :key="order.id"
           class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">Order #{{ order.id.slice(-6) }}</h3>
            <p class="text-gray-600">{{ new Date(order.createdAt.toDate()).toLocaleString() }}</p>
          </div>
          
          <span :class="getStatusClass(order.status)"
                class="px-3 py-1 rounded-full text-sm font-medium">
            {{ order.status }}
          </span>

          <button 
            v-if="order.status === 'pending'"
            @click="cancelOrder(order.id)"
            class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors">
            Cancel Order
          </button>
        </div>

        <div class="mt-4">
          <h4 class="font-medium mb-2">Items:</h4>
          <ul class="space-y-2">
            <li v-for="item in order.items" :key="item.productId"
                class="flex justify-between">
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>₱{{ (item.price * item.quantity).toFixed(2) }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-4 flex justify-between items-center border-t pt-4">
          <span class="text-gray-600">Total:</span>
          <span class="text-xl font-semibold text-indigo-600">₱{{ order.total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="orderStore.orders.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No orders yet</h3>
        <p class="mt-1 text-gray-500">Your orders will appear here after you make a purchase</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from '@/stores/order';

const authStore = useAuthStore();
const orderStore = useOrderStore();

onMounted(() => {
  if (authStore.user) {
    orderStore.subscribeToBuyerOrders(authStore.user.uid);
  }
});

onUnmounted(() => {
  orderStore.cleanup();
});

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classes[status] || classes.pending;
};

const cancelOrder = async (orderId) => {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  
  try {
    await orderStore.cancelOrder(orderId);
  } catch (error) {
    console.error('Error cancelling order:', error);
    alert(error.message);
  }
};
</script>
