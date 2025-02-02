<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Marketplace</h1>
      
      <div class="flex space-x-4">
        <input type="text" v-model="postalCode" placeholder="Enter postal code"
               class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        
        <label class="flex items-center">
          <input type="checkbox" v-model="showDisasterAffected"
                 class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          <span class="ml-2">Support Disaster Affected Sellers</span>
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in filteredProducts" :key="product.id"
           :class="[
             'bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300',
             product.seller?.isDisasterAffected ? 'ring-2 ring-red-500' : ''
           ]">
        <div class="p-4">
          <div v-if="product.seller?.isDisasterAffected" 
               class="mb-2 inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            ❤️ Disaster Affected Seller
          </div>
          
          <h3 class="text-lg font-semibold">{{ product.name }}</h3>
          <p class="text-gray-600 mt-1">{{ product.description }}</p>
          <p class="text-sm text-gray-500 mt-1">
            Seller: {{ product.seller?.storeName }}
            <span v-if="product.seller?.postalCode">({{ product.seller.postalCode }})</span>
          </p>
          
          <div class="mt-4 flex justify-between items-center">
            <span class="text-lg font-bold">₱{{ product.price }}</span>
            <button @click="addToCart(product)"
                    class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';

const productStore = useProductStore();
const cartStore = useCartStore();

const postalCode = ref('');
const showDisasterAffected = ref(false);

const filteredProducts = computed(() => {
  let filtered = productStore.products;
  
  if (postalCode.value) {
    filtered = filtered.filter(product => 
      product.seller?.postalCode.startsWith(postalCode.value)
    );
  }
  
  if (showDisasterAffected.value) {
    filtered = filtered.filter(product => 
      product.seller?.isDisasterAffected
    );
  }
  
  return filtered;
});

const addToCart = (product) => {
  cartStore.addItem({
    productId: product.id,
    name: product.name,
    price: product.price,
    sellerId: product.sellerId,
    quantity: 1
  });
};
</script>
