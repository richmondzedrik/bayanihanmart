<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 transform transition-all duration-500 hover:scale-105">
          About BayanihanMart
        </h1>
        <p class="text-xl text-gray-600 animate-fadeIn">
          Empowering communities through digital commerce
        </p>
      </div>
      
      <!-- Main Content -->
      <div class="space-y-16">
        <!-- Mission Section -->
        <div class="hover:transform hover:translate-x-2 transition-all duration-300">
          <h2 class="text-3xl font-semibold text-gray-900 mb-4 flex items-center">
            <span class="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            Our Mission
          </h2>
          <p class="text-lg text-gray-600 leading-relaxed pl-14">
            To create a resilient marketplace that supports local communities, especially during times of crisis,
            by facilitating direct connections between buyers and sellers.
          </p>
        </div>

        <!-- Vision Section -->
        <div class="hover:transform hover:translate-x-2 transition-all duration-300">
          <h2 class="text-3xl font-semibold text-gray-900 mb-4 flex items-center">
            <span class="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </span>
            Our Vision
          </h2>
          <p class="text-lg text-gray-600 leading-relaxed pl-14">
            To be the leading community marketplace that empowers local businesses and promotes 
            economic resilience through technology and community support.
          </p>
        </div>

        <!-- Features Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div v-for="(feature, index) in features" :key="index"
               class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center mb-4">
              <span class="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg text-white mr-4">
                <component :is="feature.icon" class="w-6 h-6" />
              </span>
              <h3 class="text-xl font-semibold text-gray-900">{{ feature.title }}</h3>
            </div>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const features = ref([
  {
    title: 'Direct Connections',
    description: 'Connect directly with local sellers and support your community\'s growth.',
    icon: 'svg-connection'
  },
  {
    title: 'Disaster Support',
    description: 'Special features to help identify and support disaster-affected sellers.',
    icon: 'svg-support'
  },
  {
    title: 'Secure Platform',
    description: 'Safe and secure marketplace transactions for peace of mind.',
    icon: 'svg-security'
  },
  {
    title: 'Community Focus',
    description: 'Built around strengthening local community connections and support.',
    icon: 'svg-community'
  }
]);
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* SVG Icons Components */
.svg-connection {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 24 24" fill="none" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>');
}

.svg-support {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 24 24" fill="none" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>');
}

.svg-security {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 24 24" fill="none" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>');
}

.svg-community {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 24 24" fill="none" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>');
}
</style>
