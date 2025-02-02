<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-indigo-600">BayanihanMart</span>
          </router-link>
          
          <!-- Navigation links -->
          <div class="ml-6 flex space-x-4">
            <router-link to="/" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </router-link>
            
            <!-- Authenticated Navigation -->
            <template v-if="authStore.user">
              <!-- Seller Navigation -->
              <div v-if="authStore.user?.role === 'seller'" class="flex space-x-4">
                <router-link to="/seller/dashboard" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </router-link>
                <router-link to="/seller/orders" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Orders
                </router-link>
              </div>

              <!-- Buyer Navigation -->
              <div v-if="authStore.user?.role === 'buyer'" class="flex space-x-4">
                <router-link to="/buyer/marketplace" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Marketplace
                </router-link>
                <router-link to="/buyer/cart" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Cart
                </router-link>
                <router-link to="/buyer/orders" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  My Orders
                </router-link>
              </div>
            </template>

            <!-- Add these links inside the navigation links div, after the Home link -->
            <router-link to="/about" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              About
            </router-link>
            <router-link to="/contact" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </router-link>
          </div>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center">
          <template v-if="authStore.user">
            <span class="mr-4">{{ authStore.user?.name }}</span>
            <button @click="handleLogout" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
              Logout
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Login
            </router-link>
            <router-link to="/register" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
              Register
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const homeRoute = computed(() => {
  return authStore.user?.role === 'seller' ? '/seller/dashboard' : '/buyer/marketplace';
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>
