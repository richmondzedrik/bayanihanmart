<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-12 animate-fadeIn">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Get in Touch
        </h1>
        <p class="text-gray-600 text-lg">We'd love to hear from you. Send us a message!</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform hover:scale-[1.02] transition-all duration-300">
        <div class="grid md:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div class="space-y-8">
            <div class="animate-slideLeft">
              <h3 class="text-2xl font-semibold mb-4 text-gray-900">Contact Information</h3>
              <div class="space-y-4">
                <div class="flex items-center space-x-4 text-gray-600 hover:text-indigo-600 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@bayanihanmart.com</span>
                </div>
                <div class="flex items-center space-x-4 text-gray-600 hover:text-indigo-600 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+63 123 456 7890</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6 animate-slideRight">
            <div class="transform transition-all duration-200 hover:translate-y-[-2px]">
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input v-model="formData.name" type="text" required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
            </div>

            <div class="transform transition-all duration-200 hover:translate-y-[-2px]">
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input v-model="formData.email" type="email" required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
            </div>

            <div class="transform transition-all duration-200 hover:translate-y-[-2px]">
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input v-model="formData.subject" type="text" required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
            </div>

            <div class="transform transition-all duration-200 hover:translate-y-[-2px]">
              <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea v-model="formData.message" rows="4" required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"></textarea>
            </div>

            <button type="submit" 
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 font-medium">
              Send Message
            </button>

            <div v-if="submitStatus" 
              :class="[
                'text-center py-3 px-4 rounded-lg transition-all duration-300 transform',
                submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              ]">
              {{ submitStatus.message }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitStatus = ref(null);

const handleSubmit = async () => {
  try {
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    submitStatus.value = {
      success: true,
      message: 'Message sent successfully! We will get back to you soon.'
    };
    formData.value = { name: '', email: '', subject: '', message: '' };
  } catch (error) {
    submitStatus.value = {
      success: false,
      message: 'Failed to send message. Please try again.'
    };
  }
};
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 1s ease-out;
}

.animate-slideLeft {
  animation: slideLeft 0.8s ease-out;
}

.animate-slideRight {
  animation: slideRight 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
