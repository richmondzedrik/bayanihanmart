<template>
  <div>
    <!-- Hero Section with Background -->
    <div class="relative bg-gradient-to-r from-indigo-700 to-purple-800 text-white">
      <!-- Main content with padding to account for wave -->
      <div class="relative z-10 py-16 md:py-32">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 md:mb-8 leading-tight tracking-tight">
              Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">BayanihanMart</span>
            </h1>
            <p class="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 text-gray-100 leading-relaxed max-w-3xl mx-auto px-4">
              Your community marketplace connecting local sellers and buyers, empowering disaster-affected communities through digital commerce
            </p>
            
            <div v-if="!authStore.user" class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 px-4">
              <router-link to="/register" 
                class="w-full sm:w-auto inline-block bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 transform hover:scale-105 transition-all shadow-lg">
                Start Selling Today
              </router-link>
              <router-link to="/login"
                class="w-full sm:w-auto inline-block bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/30">
                Sign In
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Updated wave decoration with proper positioning -->
      <div class="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
        <svg class="relative block w-full h-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#ffffff" fill-opacity="1" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
        </svg>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-gray-900">Why Choose BayanihanMart?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 max-w-6xl mx-auto">
          <div class="text-center p-6 md:p-8 rounded-xl hover:shadow-xl transition-all duration-300 bg-gray-50">
            <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-900">Support Local Sellers</h3>
            <p class="text-gray-600 leading-relaxed">Connect directly with local sellers and support your community's economic growth</p>
          </div>
          
          <div class="text-center p-6 md:p-8 rounded-xl hover:shadow-xl transition-all duration-300 bg-gray-50">
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-900">Help Disaster-Affected Areas</h3>
            <p class="text-gray-600 leading-relaxed">Make a difference by supporting sellers from disaster-affected communities</p>
          </div>
          
          <div class="text-center p-6 md:p-8 rounded-xl hover:shadow-xl transition-all duration-300 bg-gray-50">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-900">Secure Transactions</h3>
            <p class="text-gray-600 leading-relaxed">Safe and secure marketplace transactions</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Products Section -->
    <div class="bg-gray-50 py-16 md:py-24">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-gray-900">Featured Products</h2>
        
        <div v-if="loading" class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>

        <div v-else-if="error" class="text-center text-red-600">
          {{ error }}
        </div>

        <div v-else class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div v-for="product in products.slice(0, 6)" :key="product.id"
                 class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div class="p-4 md:p-6">
                <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2">{{ product.name }}</h3>
                <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <span class="text-xl md:text-2xl font-bold text-indigo-600">₱{{ product.price }}</span>
                  <router-link :to="authStore.user ? '/buyer/marketplace' : '/login'"
                    class="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all font-medium text-center">
                    {{ authStore.user ? 'View Details' : 'Sign in to Buy' }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-12 md:mt-16 px-4">
            <router-link to="/buyer/marketplace"
              class="w-full sm:w-auto inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-all shadow-lg">
              View All Products
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { useAuthStore } from '@/stores/auth';

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const authStore = useAuthStore();

const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    products.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    error.value = 'Error loading products';
    console.error('Error fetching products:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
