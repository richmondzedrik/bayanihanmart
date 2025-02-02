<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Seller Dashboard</h1>
      
      <!-- Disaster Status Toggle -->
      <div class="mt-4">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="isDisasterAffected" class="sr-only peer" @change="updateDisasterStatus">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-900">Disaster Affected Area</span>
        </label>
      </div>

      <!-- Product Management -->
      <div class="mt-8">
        <button @click="showAddModal = true" 
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add New Product
        </button>
      </div>

      <!-- Products List -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in productStore.products" :key="product.id" 
             class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold">{{ product.name }}</h3>
          <p class="text-gray-600">₱{{ product.price }}</p>
          <p class="text-sm text-gray-500">Stock: {{ product.stock }}</p>
          <div class="mt-4 flex space-x-2">
            <button @click="editProduct(product)" 
                    class="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">
              Edit
            </button>
            <button @click="deleteProduct(product.id)" 
                    class="bg-red-100 px-3 py-1 rounded hover:bg-red-200 text-red-600">
              Delete
            </button>
          </div>
        </div>
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
