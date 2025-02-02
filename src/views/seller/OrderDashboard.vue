<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Order Dashboard</h1>

    <div class="grid grid-cols-1 gap-6">
      <div v-for="order in orderStore.orders" :key="order.id"
           class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">Order #{{ order.id.slice(-6) }}</h3>
            <p class="text-gray-600">{{ new Date(order.createdAt.toDate()).toLocaleString() }}</p>
            <div class="mt-2">
              <p class="font-medium">Customer: {{ order.buyerName }}</p>
              <p>Total: ₱{{ order.total.toFixed(2) }}</p>
            </div>
          </div>
          
          <div class="text-right">
            <span :class="getStatusClass(order.status)"
                  class="px-3 py-1 rounded-full text-sm font-medium">
              {{ order.status }}
            </span>
          </div>
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

        <div class="mt-4 flex justify-end space-x-2">
          <select v-model="order.status" 
                  @change="updateStatus(order.id, $event.target.value)"
                  class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
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
let unsubscribe = null;

onMounted(() => {
  if (authStore.user) {
    unsubscribe = orderStore.subscribeToOrders(authStore.user.uid);
  }
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
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

const updateStatus = async (orderId, status) => {
  try {
    await orderStore.updateOrderStatus(orderId, status);
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};
</script>
