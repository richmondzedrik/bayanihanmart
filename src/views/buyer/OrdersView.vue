<template>
  <div class="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
      <p class="mt-2 text-sm sm:text-base text-gray-600">Track and manage your orders</p>
    </div>

    <!-- Loading State -->
    <div v-if="orderStore.loading" class="flex justify-center py-8 sm:py-12">
      <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="orderStore.error" 
         class="bg-red-50 text-red-600 p-4 rounded-lg text-sm sm:text-base">
      {{ orderStore.error }}
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4 sm:space-y-6">
      <div v-for="order in orderStore.orders" 
           :key="order.id"
           class="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <!-- Order Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h3 class="text-base sm:text-lg font-semibold flex items-center gap-2">
              <span>Order #{{ order.id.slice(-6) }}</span>
              <span :class="[
                getStatusClass(order.status),
                'px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium'
              ]">
                {{ order.status }}
              </span>
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ new Date(order.createdAt.toDate()).toLocaleString() }}
            </p>
          </div>
          
          <button v-if="order.status === 'pending'"
                  @click="cancelOrder(order.id)"
                  class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 
                         hover:bg-red-50 rounded-md transition-colors border border-red-200 
                         hover:border-red-300 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel Order
          </button>
        </div>

        <!-- Order Items -->
        <div class="mt-4 bg-gray-50 rounded-md p-3 sm:p-4">
          <h4 class="font-medium mb-3 text-sm sm:text-base">Order Items</h4>
          <ul class="space-y-2 divide-y divide-gray-200">
            <li v-for="item in order.items" 
                :key="item.productId"
                class="flex justify-between pt-2 text-sm sm:text-base">
              <div class="flex-1">
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-gray-600 text-sm">Quantity: {{ item.quantity }}</p>
              </div>
              <p class="font-medium text-gray-900">₱{{ (item.price * item.quantity).toFixed(2) }}</p>
            </li>
          </ul>
        </div>

        <!-- Order Total -->
        <div class="mt-4 flex justify-between items-center border-t pt-4">
          <span class="text-gray-600 text-sm sm:text-base">Order Total:</span>
          <span class="text-lg sm:text-xl font-semibold text-indigo-600">₱{{ order.total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="orderStore.orders.length === 0" 
           class="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm">
        <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-base sm:text-lg font-medium text-gray-900">No orders yet</h3>
        <p class="mt-1 text-sm text-gray-500">Start shopping to see your orders here</p>
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
