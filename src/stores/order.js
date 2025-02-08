import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy, getDoc, writeBatch } from 'firebase/firestore';
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

  function subscribeToBuyerOrders(buyerId) {
    if (!buyerId) return null;
    
    try {
      loading.value = true;
      error.value = null;

      const q = query(
        collection(db, 'orders'),
        where('buyerId', '==', buyerId),
        orderBy('createdAt', 'desc')
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

      return unsubscribe;
    } catch (e) {
      console.error('Error setting up orders subscription:', e);
      error.value = 'Failed to set up orders subscription';
      loading.value = false;
      return null;
    }
  }

  async function cancelOrder(orderId) {
    try {
      loading.value = true;
      error.value = null;
      
      // Get the order details first
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        throw new Error('Order not found');
      }
      
      const orderData = orderSnap.data();
      if (orderData.status !== 'pending') {
        throw new Error('Only pending orders can be cancelled');
      }
      
      // Create a batch for atomic operations
      const batch = writeBatch(db);
      
      // Update order status to cancelled
      batch.update(orderRef, {
        status: 'cancelled',
        updatedAt: new Date()
      });
      
      // Restore product stock
      for (const item of orderData.items) {
        const productRef = doc(db, 'products', item.productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock;
          batch.update(productRef, {
            stock: currentStock + item.quantity,
            updatedAt: new Date()
          });
        }
      }
      
      // Commit all changes atomically
      await batch.commit();
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    orders,
    loading,
    error,
    subscribeToOrders,
    subscribeToBuyerOrders,
    updateOrderStatus,
    cancelOrder,
    cleanup
  };
});
