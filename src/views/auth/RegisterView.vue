<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Full Name</label>
            <input v-model="name" id="name" name="name" type="text" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Full Name">
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input v-model="email" id="email" name="email" type="email" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input v-model="password" id="password" name="password" type="password" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <select v-model="role" required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <div v-if="role === 'seller'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input v-model="storeName" type="text" required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Your store name">
            
            <label class="block text-sm font-medium text-gray-700 mt-4 mb-2">Postal Code</label>
            <input v-model="postalCode" type="text" required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Store postal code">
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign up
          </button>
        </div>
      </form>

      <div class="text-center">
        <router-link to="/login" class="text-indigo-600 hover:text-indigo-500">
          Already have an account? Sign in
        </router-link>
      </div>

      <div v-if="error" class="mt-4 text-center text-red-600">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('buyer');
const storeName = ref('');
const postalCode = ref('');
const error = ref(null);
const errorMessage = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  try {
    error.value = null;
    errorMessage.value = '';
    loading.value = true;
    
    // Validate password
    if (password.value.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters long';
      return;
    }

    const userData = {
      name: name.value,
      email: email.value,
      role: role.value,
      ...(role.value === 'seller' && {
        storeName: storeName.value,
        postalCode: postalCode.value,
        isDisasterAffected: false
      })
    };

    // Attempt registration with retry logic
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        await authStore.register(email.value, password.value, userData);
        router.push(role.value === 'seller' ? '/seller/dashboard' : '/buyer/marketplace');
        return;
      } catch (e) {
        if (e.code === 'auth/network-request-failed' && retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        }
        throw e;
      }
    }
  } catch (e) {
    error.value = e;
    if (e.code === 'auth/network-request-failed') {
      errorMessage.value = 'Network connection failed. Please check your internet connection and try again.';
    } else if (e.code === 'auth/email-already-in-use') {
      errorMessage.value = 'This email is already registered. Please use a different email or try logging in.';
    } else if (e.code === 'auth/invalid-email') {
      errorMessage.value = 'Invalid email address.';
    } else {
      errorMessage.value = e.message || 'Registration failed. Please try again.';
    }
    console.error('Registration error:', e);
  } finally {
    loading.value = false;
  }
};
</script>
