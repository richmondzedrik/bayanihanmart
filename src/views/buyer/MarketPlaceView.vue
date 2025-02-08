<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 px-4 py-6 sm:py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Marketplace
          </h1>
          
          <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <!-- Search and Filter Section -->
            <div class="flex flex-wrap gap-4 items-center">
              <div class="relative">
                <input 
                  type="text" 
                  v-model="postalCode" 
                  placeholder="Enter postal code"
                  class="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>

              <select 
                v-model="sortBy"
                class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
              
              <label class="flex items-center gap-2 cursor-pointer group">   
                <input 
                  type="checkbox" 
                  v-model="showDisasterAffected"
                  class="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200"
                >
                <span class="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors duration-200">
                  Support Disaster Affected Sellers ❤️
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>

      <!-- Products Grid -->
      <TransitionGroup 
        name="product-list" 
        tag="div" 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div 
          v-for="product in sortedAndFilteredProducts" 
          :key="product.id"
          class="group bg-white rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <!-- Product Image -->
          <div v-if="product.imageUrl" class="aspect-w-16 aspect-h-9 bg-gray-100">
            <img :src="product.imageUrl" :alt="product.name" 
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
          </div>
          
          <div class="p-5">
            <div v-if="product.seller?.isDisasterAffected" 
              class="mb-3 inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium animate-pulse">
              ❤️ Disaster Affected Seller
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
              {{ product.name }}
            </h3>
            <p class="text-gray-600 mt-2 line-clamp-2">{{ product.description }}</p>
            
            <div class="mt-3 flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              {{ product.seller?.storeName }}
              <span v-if="product.seller?.postalCode" class="ml-1 text-gray-400">
                ({{ product.seller.postalCode }})
              </span>
            </div>
            
            <div class="mt-4 flex items-center justify-between">
              <div>
                <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ₱{{ product.price }}
                </span>
                <div class="text-sm text-gray-600 mt-1">
                  Stock: 
                  <span :class="[
                    'px-2 py-0.5 rounded-full text-sm font-medium',
                    product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]">
                    {{ product.stock }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div v-if="product.stock > 0" class="flex items-center gap-2">
                  <!-- Quantity Controls -->
                  <div class="flex items-center border rounded-lg overflow-hidden bg-white">
                    <button @click.stop="decrementQuantity(product.id)"
                      class="px-2 py-1 text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                      <span class="text-lg font-medium">-</span>
                    </button>
                    <input type="number" 
                      :value="getQuantity(product.id)"
                      @input="updateQuantityInput(product.id, $event)"
                      class="w-12 text-center border-x py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      :max="product.stock">
                    <button @click.stop="incrementQuantity(product.id, product.stock)"
                      class="px-2 py-1 text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                      <span class="text-lg font-medium">+</span>
                    </button>
                  </div>

                  <!-- Add to Cart Button -->
                  <button @click="addToCart({ ...product, quantity: getQuantity(product.id) })"
                    class="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Add to Cart
                  </button>
                </div>
                
                <button v-else
                  disabled
                  class="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                  Out of Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="sortedAndFilteredProducts.length === 0" class="text-center py-16">
        <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-gray-500">Try adjusting your search criteria</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';

const productStore = useProductStore();
const cartStore = useCartStore();

const postalCode = ref('');
const showDisasterAffected = ref(false);
const sortBy = ref('default');
const loading = ref(true);

let unsubscribe = null;

onMounted(async () => {
  try {
    unsubscribe = await productStore.fetchProducts();
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const sortedAndFilteredProducts = computed(() => {
  let filtered = productStore.products;
  
  if (postalCode.value) {
    filtered = filtered.filter(product => 
      product.seller?.postalCode?.startsWith(postalCode.value)
    );
  }
  
  if (showDisasterAffected.value) {
    filtered = filtered.filter(product => 
      product.seller?.isDisasterAffected
    );
  }

  switch (sortBy.value) {
    case 'price-asc':
      return [...filtered].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...filtered].sort((a, b) => b.price - a.price);
    case 'name':
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return filtered;
  }
});

const quantityMap = ref({});

const getQuantity = (productId) => {
  return quantityMap.value[productId] || 1;
};

const incrementQuantity = (productId, maxStock) => {
  const currentQty = getQuantity(productId);
  if (currentQty < maxStock) {
    quantityMap.value[productId] = currentQty + 1;
  }
};

const decrementQuantity = (productId) => {
  const currentQty = getQuantity(productId);
  if (currentQty > 1) {
    quantityMap.value[productId] = currentQty - 1;
  }
};

const updateQuantityInput = (productId, event) => {
  const value = parseInt(event.target.value) || 1;
  const product = productStore.products.find(p => p.id === productId);
  if (product) {
    quantityMap.value[productId] = Math.min(Math.max(1, value), product.stock);
  }
};

const addToCart = (product) => {
  if (product.stock <= 0) return;
  
  const quantity = getQuantity(product.id);
  if (quantity > product.stock) return;

  cartStore.addItem({
    productId: product.id,
    name: product.name,
    price: product.price,
    sellerId: product.sellerId,
    stock: product.stock,
    quantity
  });

  quantityMap.value[product.id] = 1;
};
</script>

<style scoped>
.product-list-enter-active,
.product-list-leave-active {
  transition: all 0.3s ease;
}

.product-list-enter-from,
.product-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.product-list-move {
  transition: transform 0.3s ease;
}
</style>
