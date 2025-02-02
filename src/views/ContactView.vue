<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" v-model="formData.name" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="formData.email" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
          <input type="text" id="subject" v-model="formData.subject" required
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" v-model="formData.message" rows="4" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
        </div>

        <div>
          <button type="submit" 
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Send Message
          </button>
        </div>

        <div v-if="submitStatus" :class="submitStatus.success ? 'text-green-600' : 'text-red-600'"
             class="mt-4 text-center">
          {{ submitStatus.message }}
        </div>
      </form>
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
