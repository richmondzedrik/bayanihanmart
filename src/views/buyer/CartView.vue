<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4">
        <svg class="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">Your cart is empty</h3>
      <router-link to="/buyer/marketplace" 
        class="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
        Continue Shopping
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm divide-y">
          <div v-for="item in cartStore.items" :key="item.productId" 
               class="p-6 flex items-center space-x-4">
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
              <p class="text-gray-600">₱{{ item.price }} each</p>
              <p class="text-sm text-gray-500">Available: {{ item.stock }}</p>
            </div>
            
            <div class="flex items-center space-x-2">
              <button @click="updateQuantity(item.productId, item.quantity - 1)"
                      class="p-1 rounded-full hover:bg-gray-100"
                      :disabled="item.quantity <= 1">
                <svg class="w-6 h-6" :class="item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                </svg>
              </button>
              
              <span class="w-8 text-center">{{ item.quantity }}</span>
              
              <button @click="updateQuantity(item.productId, item.quantity + 1)"
                      class="p-1 rounded-full hover:bg-gray-100"
                      :disabled="item.quantity >= item.stock">
                <svg class="w-6 h-6" :class="item.quantity >= item.stock ? 'text-gray-300' : 'text-gray-600'" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </button>
            </div>
            
            <div class="text-right">
              <p class="text-lg font-medium text-gray-900">
                ₱{{ (item.price * item.quantity).toFixed(2) }}
              </p>
              <button @click="removeItem(item.productId)" 
                      class="text-sm text-red-600 hover:text-red-700">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="text-gray-900 font-medium">₱{{ cartStore.total.toFixed(2) }}</span>
            </div>
            
            <div class="border-t pt-4">
              <div class="flex justify-between font-medium">
                <span class="text-gray-900">Total</span>
                <span class="text-indigo-600 text-xl">₱{{ cartStore.total.toFixed(2) }}</span>
              </div>
            </div>

            <button @click="checkout" 
                    :disabled="processing"
                    class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                           disabled:opacity-50 disabled:cursor-not-allowed">
              {{ processing ? 'Processing...' : 'Checkout' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { collection, addDoc, doc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { useProductStore } from '@/stores/product';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const productStore = useProductStore();
const processing = ref(false);

const updateQuantity = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity);
};

const removeItem = (productId) => {
  cartStore.removeItem(productId);
};

const checkout = async () => {
  if (!authStore.user) return;
  
  try {
    processing.value = true;
    
    // Create a batch for atomic operations
    const batch = writeBatch(db);
    
    // Get the seller ID from the first item (assuming all items are from same seller)
    const firstItem = cartStore.items[0];
    if (!firstItem) throw new Error('Cart is empty');
    
    const productRef = doc(db, 'products', firstItem.productId);
    const productSnap = await getDoc(productRef);
    const sellerId = productSnap.data()?.sellerId;
    
    if (!sellerId) throw new Error('Seller information not found');
    
    // Verify current stock and update product quantities
    for (const item of cartStore.items) {
      const productRef = doc(db, 'products', item.productId);
      const productSnap = await getDoc(productRef);
      
      if (!productSnap.exists()) {
        throw new Error(`Product ${item.productId} not found`);
      }
      
      const currentStock = productSnap.data().stock;
      if (currentStock < item.quantity) {
        throw new Error(`Not enough stock for ${item.name}. Available: ${currentStock}`);
      }
      
      // Update stock in batch
      batch.update(productRef, {
        stock: currentStock - item.quantity,
        updatedAt: new Date()
      });
    }

    // Create the order document
    const orderRef = doc(collection(db, 'orders'));
    batch.set(orderRef, {
      buyerId: authStore.user.uid,
      sellerId: sellerId,
      buyerName: authStore.user.displayName || authStore.user.email,
      items: cartStore.items,
      total: cartStore.total,
      status: 'pending',
      createdAt: new Date()
    });

    // Commit all changes atomically
    await batch.commit();
    
    // Add notification for new order
    await addDoc(collection(db, 'notifications'), {
      userId: sellerId,
      type: 'order',
      message: `New order received from ${authStore.user.displayName || authStore.user.email}`,
      read: false,
      createdAt: new Date(),
      orderId: orderRef.id
    });
    
    // Refresh product store to update stock numbers everywhere
    await productStore.fetchProducts();
    
    // Clear the cart after successful checkout
    cartStore.clearCart();
    
    // Navigate to orders page
    router.push('/buyer/orders');
  } catch (error) {
    console.error('Checkout error:', error);
    alert(error.message);
  } finally {
    processing.value = false;
  }
};
</script>
