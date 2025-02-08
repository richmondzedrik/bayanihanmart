<template>
  <nav class="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Desktop Navigation -->
        <div class="flex items-center">
          <router-link to="/" 
            class="flex-shrink-0 flex items-center transform hover:scale-105 transition-transform duration-200">
            <span class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BayanihanMart
            </span>
          </router-link>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex ml-8 space-x-1">
            <router-link v-for="link in navigationLinks" 
              :key="link.to"
              :to="link.to"
              class="group px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 transition-all duration-200 text-sm font-medium relative"
              :class="{ 'bg-indigo-50 text-indigo-700': $route.path === link.to }">
              {{ link.text }}
              <span class="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-indigo-600 group-hover:w-1/2 transition-all duration-300"></span>
            </router-link>
          </div>
        </div>

        <!-- Desktop Right Section -->
        <div class="hidden md:flex items-center space-x-4">
          <NotificationDropdown class="ml-4" />
          
          <template v-if="authStore.user">
            <div class="relative group">
              <button class="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                <span>{{ authStore.user?.name }}</span>
                <svg class="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                  Profile
                </router-link>
                <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                  Logout
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" 
              class="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Login
            </router-link>
            <router-link to="/register" 
              class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105">
              Register
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex items-center md:hidden">
          <NotificationDropdown class="mr-2" />
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform -translate-y-4"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform -translate-y-4"
      >
        <div v-show="isMobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <router-link v-for="link in navigationLinks"
              :key="link.to"
              :to="link.to"
              class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              :class="{ 'bg-indigo-50 text-indigo-600': $route.path === link.to }"
              @click="isMobileMenuOpen = false">
              {{ link.text }}
            </router-link>
          </div>

          <!-- Mobile Auth Section -->
          <div class="pt-4 pb-3 border-t border-gray-200">
            <template v-if="authStore.user">
              <div class="px-3 py-2">
                <p class="text-base font-medium text-gray-800">{{ authStore.user?.name }}</p>
                <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
              </div>
              <div class="space-y-1">
                <router-link to="/profile"
                  class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  @click="isMobileMenuOpen = false">
                  Profile
                </router-link>
                <button @click="handleLogoutMobile" 
                  class="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">
                  Logout
                </button>
              </div>
            </template>
            <template v-else>
              <div class="space-y-1">
                <router-link to="/login"
                  class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  @click="isMobileMenuOpen = false">
                  Login
                </router-link>
                <router-link to="/register"
                  class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  @click="isMobileMenuOpen = false">
                  Register
                </router-link>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import NotificationDropdown from './NotificationDropdown.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);

// Close mobile menu when route changes
watch(route, () => {
  isMobileMenuOpen.value = false;
});

const navigationLinks = computed(() => {
  const links = [{ to: '/', text: 'Home' }];
  
  if (authStore.user) {
    if (authStore.user.role === 'seller') {
      links.push(
        { to: '/seller/dashboard', text: 'Dashboard' },
        { to: '/seller/orders', text: 'Orders' }
      );
    } else if (authStore.user.role === 'buyer') {
      links.push(
        { to: '/buyer/marketplace', text: 'Marketplace' },
        { to: '/buyer/cart', text: 'Cart' },
        { to: '/buyer/orders', text: 'My Orders' }
      );
    }
  }
  
  return links;
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const handleLogoutMobile = async () => {
  isMobileMenuOpen.value = false;
  await handleLogout();
};
</script>
