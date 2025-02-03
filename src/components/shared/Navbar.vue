<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BayanihanMart
            </span>
          </router-link>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex ml-8 space-x-1">
            <router-link to="/" 
              class="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 text-sm font-medium">
              Home
            </router-link>
            
            <!-- Authenticated Navigation -->    
            <template v-if="authStore.user">
              <!-- Seller Navigation -->
              <div v-if="authStore.user?.role === 'seller'" class="flex space-x-1">
                <router-link to="/seller/dashboard" 
                  class="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 text-sm font-medium">
                  Dashboard
                </router-link>
                <router-link to="/seller/orders"
                  class="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 text-sm font-medium">
                  Orders
                </router-link>
              </div>

              <!-- Buyer Navigation -->
              <div v-if="authStore.user?.role === 'buyer'" class="flex space-x-1">
                <router-link to="/buyer/marketplace"
                  class="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 text-sm font-medium">
                  Marketplace
                </router-link>
                <router-link to="/buyer/cart"
                  class="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 text-sm font-medium">
                  Cart
                </router-link>
                <router-link to="/buyer/orders"
                  class="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 text-sm font-medium">
                  My Orders
                </router-link>
              </div>
            </template>

            <router-link to="/about"
              class="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 text-sm font-medium">
              About
            </router-link>
            <router-link to="/contact"
              class="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 text-sm font-medium">
              Contact
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Desktop Auth Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="authStore.user">
            <router-link to="/profile" 
              class="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              {{ authStore.user?.name }}
            </router-link>
            <button @click="handleLogout" 
              class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow">
              Logout
            </button>
          </template>
          <template v-else>
            <router-link to="/login" 
              class="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Login
            </router-link>
            <router-link to="/register" 
              class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow">
              Register
            </router-link>
          </template>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Home
          </router-link>
          
          <template v-if="authStore.user">
            <template v-if="authStore.user?.role === 'seller'">
              <router-link to="/seller/dashboard" 
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Dashboard
              </router-link>
              <router-link to="/seller/orders"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Orders
              </router-link>
            </template>

            <template v-if="authStore.user?.role === 'buyer'">
              <router-link to="/buyer/marketplace"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Marketplace
              </router-link>
              <router-link to="/buyer/cart"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Cart
              </router-link>
            </template>
          </template>

          <!-- Mobile Auth Buttons -->
          <div class="pt-4 pb-3 border-t border-gray-200">
            <template v-if="authStore.user">
              <router-link to="/profile"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                {{ authStore.user?.name }}
              </router-link>
              <button @click="handleLogout" 
                class="block w-full text-left mt-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Logout
              </button>
            </template>
            <template v-else>
              <router-link to="/login"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Login
              </router-link>
              <router-link to="/register"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const homeRoute = computed(() => {
  return authStore.user?.role === 'seller' ? '/seller/dashboard' : '/buyer/marketplace';
});

const isMobileMenuOpen = ref(false);

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>
