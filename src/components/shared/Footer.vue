<template>
  <footer class="bg-gray-900 text-white mt-auto py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <!-- About Section -->
        <div class="col-span-1 sm:col-span-2">
          <h3 class="text-lg font-semibold mb-3">BayanihanMart</h3>
          <p class="text-sm text-gray-400">
            Connecting local sellers and buyers, empowering disaster-affected communities.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="col-span-1">
          <h3 class="text-sm font-semibold mb-3">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-sm text-gray-400 hover:text-white transition-colors">
                Home
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="text-sm text-gray-400 hover:text-white transition-colors">
                About
              </router-link>
            </li>
            <li>
              <router-link to="/buyer/marketplace" class="text-sm text-gray-400 hover:text-white transition-colors">
                Marketplace
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="col-span-1">
          <h3 class="text-sm font-semibold mb-3">Contact</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li>support@bayanihanmart.com</li>
            <li>+63 123 456 7890</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} BayanihanMart. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>