<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Title -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Create Account
        </h2>
        <p class="text-gray-600 text-sm mb-8">Join BayanihanMart community today</p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white p-8 rounded-2xl shadow-xl">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input v-model="name" type="text" required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input v-model="email" type="email" required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input v-model="password" type="password" required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Create a password">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input v-model="confirmPassword" type="password" required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Confirm your password">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select v-model="role"
              class="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div v-if="role === 'seller'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input v-model="storeName" type="text"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your store name">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input v-model="postalCode" type="text" required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your postal code">
          </div>

          <div>
            <button type="submit"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-all duration-200 shadow-md hover:shadow-lg">
              Create Account
            </button>
          </div>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" 
              class="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
              Sign in here
            </router-link>
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 text-center text-sm text-red-600">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>

  <!-- Add this after successful registration -->
  <div v-if="registrationComplete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4">
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h3>
      <p class="text-gray-600 mb-6">
        We've sent a verification link to your email address. Please check your inbox and verify your email to continue.
      </p>
      <router-link to="/login"
        class="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
        Go to Login
      </router-link>
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
const confirmPassword = ref('');
const role = ref('buyer');
const storeName = ref('');
const postalCode = ref('');
const error = ref(null);
const errorMessage = ref('');
const loading = ref(false);
const registrationComplete = ref(false);

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

    // Validate confirm password
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match';
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
        registrationComplete.value = true;
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
