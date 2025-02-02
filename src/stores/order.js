import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

export const useOrderStore = defineStore('order', () => {
  const orders = ref([]);
  const loading = ref(false);
  const error = ref(null);
  let unsubscribe = null;

  // Real-time orders subscription with error handling
  function subscribeToOrders(sellerId) {
    if (!sellerId) return null;
    
    try {
      loading.value = true;
      error.value = null;

      const q = query(
        collection(db, 'orders'),
        where('sellerId', '==', sellerId)
      );

      unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          orders.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          loading.value = false;
        },
        (err) => {
          console.error('Orders subscription error:', err);
          error.value = 'Failed to load orders. Please try again.';
          loading.value = false;
        }
      );

      return () => {
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
      };
    } catch (e) {
      console.error('Error setting up orders subscription:', e);
      error.value = 'Failed to set up orders subscription';
      loading.value = false;
      return null;
    }
  }

  // Update order status
  async function updateOrderStatus(orderId, status) {
    try {
      loading.value = true;
      error.value = null;
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: new Date()
      });
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // Cleanup function
  function cleanup() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  return {
    orders,
    loading,
    error,
    subscribeToOrders,
    updateOrderStatus,
    cleanup
  };
});
