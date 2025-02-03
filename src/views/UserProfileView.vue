<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:py-12">
    <div class="max-w-lg mx-auto">
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Profile Settings
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input v-model="profileData.name" type="text" required
              class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input :value="authStore.user?.email" type="email" disabled
              class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base">
          </div>

          <div v-if="authStore.user?.role === 'seller'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input v-model="profileData.storeName" type="text" required
              class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input v-model="profileData.postalCode" type="text" required
              class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base">
          </div>

          <div class="pt-4">
            <button type="submit"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-all duration-200 text-sm sm:text-base">
              Save Changes
            </button>
          </div>
        </form>

        <div v-if="updateStatus" :class="[
          'mt-4 p-3 sm:p-4 rounded-lg text-center text-sm sm:text-base',
          updateStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        ]">
          {{ updateStatus.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

const authStore = useAuthStore();
const updateStatus = ref(null);

const profileData = ref({
  name: '',
  storeName: '',
  postalCode: '',
});

onMounted(() => {
  if (authStore.user) {
    profileData.value = {
      name: authStore.user.name || '',
      storeName: authStore.user.storeName || '',
      postalCode: authStore.user.postalCode || '',
    };
  }
});

const handleSubmit = async () => {
  try {
    const userRef = doc(db, 'users', authStore.user.uid);
    await updateDoc(userRef, {
      ...profileData.value,
      updatedAt: new Date()
    });

    // Update local auth store
    authStore.user = {
      ...authStore.user,
      ...profileData.value
    };

    updateStatus.value = {
      success: true,
      message: 'Profile updated successfully!'
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    updateStatus.value = {
      success: false,
      message: 'Failed to update profile. Please try again.'
    };
  }
};
</script>
