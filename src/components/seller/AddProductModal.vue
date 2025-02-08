<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    <div class="relative top-20 mx-auto p-5 border max-w-xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Add New Product</h3>
        <form @submit.prevent="handleSubmit" class="mt-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
            <input v-model="productData.name" type="text" required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea v-model="productData.description" required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Price</label>
            <input v-model="productData.price" type="number" step="0.01" required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Stock</label>
            <input v-model="productData.stock" type="number" required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Product Image (Optional)</label>
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div v-if="!imagePreview" class="flex flex-col items-center justify-center pt-7">
                  <svg class="w-8 h-8 mb-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <p class="text-sm text-gray-500">Click to upload image</p>
                </div>
                <div v-else class="flex items-center justify-center h-full">
                  <img :src="imagePreview" alt="Preview" class="h-full object-contain">
                </div>
                <input type="file" class="hidden" accept="image/*" @change="handleImageChange">
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button type="button" @click="$emit('close')"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="loading"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {{ loading ? 'Adding...' : 'Add Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close', 'product-added']);
const authStore = useAuthStore();
const productStore = useProductStore();

const productData = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  sellerId: authStore.user?.uid
});

const imageFile = ref(null);
const imagePreview = ref(null);
const loading = ref(false);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const uploadImage = async () => {
  if (!imageFile.value) return null;
  
  try {
    const formData = new FormData();
    formData.append('file', imageFile.value);
    formData.append('upload_preset', 'dmgivh17b');
    formData.append('folder', 'bayanihanmart');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dmgivh17b/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    let imageUrl = null;
    
    if (imageFile.value) {
      try {
        imageUrl = await uploadImage();
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        alert('Failed to upload image. Please try again or skip the image.');
        loading.value = false;
        return;
      }
    }

    const productWithSeller = {
      ...productData.value,
      price: Number(productData.value.price),
      stock: Number(productData.value.stock),
      sellerId: authStore.user.uid,
      createdAt: new Date(),
      imageUrl
    };
    
    await productStore.createProduct(productWithSeller);
    emit('product-added');
    emit('close');
    
    // Reset form
    productData.value = {
      name: '',
      description: '',
      price: '',
      stock: '',
      sellerId: authStore.user?.uid
    };
    imageFile.value = null;
    imagePreview.value = null;
  } catch (error) {
    console.error('Error creating product:', error);
    alert('Failed to create product. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>
