<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 px-4 py-6 sm:py-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Section with Stats -->
      <div class="bg-white rounded-xl shadow-sm p-6 transform hover:shadow-md transition-all duration-300">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Seller Dashboard
          </h1>
          
          <!-- Quick Stats -->
          <div class="flex gap-4 text-sm">
            <div class="px-4 py-2 bg-indigo-50 rounded-lg">
              <p class="text-indigo-600 font-medium">Total Products</p>
              <p class="text-2xl font-bold text-indigo-700">{{ productStore.products.length }}</p>
            </div>
            <div class="px-4 py-2 bg-purple-50 rounded-lg">
              <p class="text-purple-600 font-medium">Active Listings</p>
              <p class="text-2xl font-bold text-purple-700">
                {{ productStore.products.filter(p => p.stock > 0).length }}
              </p>
            </div>
          </div>
        </div>

        <!-- Disaster Status Toggle -->
        <div class="mt-6 flex items-center gap-4">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="isDisasterAffected" 
                   class="sr-only peer" @change="updateDisasterStatus">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] 
                        after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                        after:transition-all peer-focus:ring-4 peer-focus:ring-indigo-300">
            </div>
            <span class="ml-3 text-sm font-medium text-gray-700">Disaster Affected Area</span>
          </label>
          
          <button @click="showAddModal = true" 
            class="ml-auto flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                   text-white px-6 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 
                   transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in productStore.products" :key="product.id" 
          class="group bg-white rounded-xl shadow-sm p-5 hover:shadow-md transform hover:-translate-y-1 
                 transition-all duration-300">
          <!-- Product Image -->
          <div v-if="product.imageUrl" 
               class="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden bg-gray-100">
            <img :src="product.imageUrl" :alt="product.name" 
                 class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300">
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">{{ product.name }}</h3>
          <p class="text-indigo-600 font-medium mt-1">₱{{ product.price }}</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-gray-500">Stock:</span>
            <span :class="[
              'px-2 py-0.5 rounded-full text-sm font-medium',
              product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]">
              {{ product.stock }}
            </span>
          </div>
          
          <!-- Action Buttons -->
          <div class="mt-4 flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <button @click="editProduct(product)" 
              class="flex-1 bg-indigo-50 px-4 py-2 rounded-lg text-indigo-600 hover:bg-indigo-100 
                     transition-colors text-sm font-medium">
              Edit
            </button>
            <button @click="deleteProduct(product.id)" 
              class="flex-1 bg-red-50 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 
                     transition-colors text-sm font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="productStore.products.length === 0" 
           class="text-center py-16 bg-white rounded-xl shadow-sm">
        <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No products yet</h3>
        <p class="mt-1 text-gray-500">Start by adding your first product</p>
      </div>
    </div>

    <!-- Modals -->
    <AddProductModal 
      :show="showAddModal"
      @close="showAddModal = false"
      @product-added="refreshProducts"
    />

    <EditProductModal
      v-if="selectedProduct"
      :show="showEditModal"
      :product="selectedProduct"
      @close="closeEditModal"
      @product-updated="refreshProducts"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';
import AddProductModal from '@/components/seller/AddProductModal.vue';
import EditProductModal from '@/components/seller/EditProductModal.vue';

const authStore = useAuthStore();
const productStore = useProductStore();

const isDisasterAffected = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedProduct = ref(null);

onMounted(async () => {
  await refreshProducts();
  if (authStore.user) {
    isDisasterAffected.value = authStore.user.isDisasterAffected || false;
  }
});

async function refreshProducts() {
  if (authStore.user) {
    try {
      await productStore.getProductsBySeller(authStore.user.uid);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
}

async function updateDisasterStatus() {
  try {
    await productStore.updateSellerDisasterStatus(authStore.user.uid, isDisasterAffected.value);
  } catch (error) {
    console.error('Error updating disaster status:', error);
    // Revert the toggle if update fails
    isDisasterAffected.value = !isDisasterAffected.value;
  }
}

function editProduct(product) {
  selectedProduct.value = { ...product };
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  selectedProduct.value = null;
}

async function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    await productStore.deleteProduct(productId);
    await refreshProducts();
  }
}
</script>
