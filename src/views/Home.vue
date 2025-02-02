<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900">Welcome to BayanihanMart</h1>
      <p class="mt-2 text-lg text-gray-600">Your community marketplace</p>
    </div>

    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="products.length === 0" class="col-span-full text-center text-gray-600">
        No products available yet.
      </div>

      <div v-for="product in products" :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
          <p class="text-gray-600 mt-1">{{ product.description }}</p>
          <div class="mt-4 flex justify-between items-center">
            <span class="text-indigo-600 font-bold">₱{{ product.price }}</span>
            <button
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300">
              View Details
            </button>
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

const products = ref([]);
const loading = ref(true);
const error = ref(null);

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
