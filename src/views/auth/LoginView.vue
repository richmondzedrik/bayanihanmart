<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-6 p-4 sm:p-0">
      <!-- Logo and Title -->
      <div class="text-center">
        <h2 class="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h2>
        <p class="text-gray-600 text-sm mb-6 sm:mb-8">Sign in to continue to BayanihanMart</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <form class="space-y-4 sm:space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input v-model="email" id="email" name="email" type="email" required
              class="appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              placeholder="Enter your email">
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input v-model="password" id="password" name="password" type="password" required
              class="appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              placeholder="Enter your password">
          </div>

          <div>
            <button type="submit"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base">
              Sign in
            </button>
          </div>
        </form>

        <!-- Registration Link -->
        <div class="mt-4 sm:mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link to="/register" 
              class="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
              Register here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  try {
    error.value = '';
    loading.value = true;

    await authStore.login(email.value, password.value);
    const userRole = authStore.user?.role;
    if (!userRole) {
      throw new Error('User role not found');
    }
    
    // Add success notification
    notificationStore.addToast({
      title: 'Welcome back!',
      message: 'You have successfully logged in.',
      type: 'success',
      duration: 5000
    });
    
    router.push(userRole === 'seller' ? '/seller/dashboard' : '/buyer/marketplace');
  } catch (e) {
    // Add error notification
    notificationStore.addNotification({
      title: 'Login Failed',
      message: e.message || 'Failed to login',
      type: 'error',
      duration: 5000
    });
    
    if (e.code === 'auth/network-request-failed') {
      error.value = 'Unable to connect to the server. Please check your internet connection and try again.';
    } else if (e.code === 'auth/invalid-credential') {
      error.value = 'Invalid email or password';
    } else {
      error.value = e.message || 'Failed to login';
    }
    console.error('Login error:', e);
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  try {
    error.value = '';
    await authStore.loginWithGoogle();
    const userData = authStore.user;
    if (!userData) {
      throw new Error('User data not found');
    }
    router.push(userData.role === 'seller' ? '/seller/dashboard' : '/buyer/marketplace');
  } catch (e) {
    error.value = e.message || 'Failed to sign in with Google';
    console.error('Google sign-in error:', e);
  }
};
</script>
