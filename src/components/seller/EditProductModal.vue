<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Edit Product</h3>
        <form @submit.prevent="handleSubmit" class="mt-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
            <input v-model="editedProduct.name" type="text" required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea v-model="editedProduct.description" required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Price</label>
            <input v-model="editedProduct.price" type="number" step="0.01" required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Stock</label>
            <input v-model="editedProduct.stock" type="number" required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>

          <div class="flex justify-end space-x-2">
            <button type="button" @click="$emit('close')"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/product';

const props = defineProps({
  show: Boolean,
  product: Object
});

const emit = defineEmits(['close', 'product-updated']);
const productStore = useProductStore();
const editedProduct = ref({ ...props.product });

onMounted(() => {
  editedProduct.value = { ...props.product };
});

const handleSubmit = async () => {
  try {
    await productStore.updateProduct(editedProduct.value.id, {
      ...editedProduct.value,
      price: Number(editedProduct.value.price),
      stock: Number(editedProduct.value.stock)
    });
    emit('product-updated');
    emit('close');
  } catch (error) {
    console.error('Error updating product:', error);
  }
};
</script>
