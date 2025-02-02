<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-5xl font-bold text-gray-900 mb-4">Welcome to BayanihanMart</h1>
      <p class="text-xl text-gray-600 mb-8">Your community marketplace connecting local sellers and buyers</p>
      
      <div v-if="!authStore.user" class="space-x-4">
        <router-link to="/register" 
          class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700">
          Get Started
        </router-link>
        <router-link to="/login"
          class="inline-block bg-white text-indigo-600 px-8 py-3 rounded-md border border-indigo-600 text-lg font-medium hover:bg-indigo-50">
          Sign In
        </router-link>
      </div>
    </div>

    <!-- Featured Products Section -->
    <div class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Featured Products</h2>
      
      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-else-if="error" class="text-center text-red-600">
        {{ error }}
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in products.slice(0, 6)" :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
            <p class="text-gray-600 mt-1">{{ product.description }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-indigo-600 font-bold">₱{{ product.price }}</span>
              <router-link :to="authStore.user ? '/buyer/marketplace' : '/login'"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                {{ authStore.user ? 'View Details' : 'Sign in to Buy' }}
              </router-link>
            </div>
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
