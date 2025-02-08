import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/services/firebase/config';
import { collection, onSnapshot, query, where, orderBy, Timestamp, doc, updateDoc, addDoc, getDocs, writeBatch } from 'firebase/firestore';
import { useAuthStore } from './auth';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([]); // Real-time notifications
  const toasts = ref([]); // Toast notifications
  const unreadCount = ref(0);
  let unsubscribe = null;

  // Real-time notifications subscription
  const subscribeToNotifications = () => {
    const authStore = useAuthStore();
    if (!authStore.user?.uid) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', authStore.user.uid),
      orderBy('createdAt', 'desc')
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const notification = {
            id: change.doc.id,
            ...change.doc.data(),
            createdAt: change.doc.data().createdAt?.toDate()
          };
          notifications.value.unshift(notification);
          if (!notification.read) {
            unreadCount.value++;
          }
        }
      });
    });
  };

  // Toast notifications
  const addToast = (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      ...toast,
      duration: toast.duration || 5000
    };
    toasts.value.push(newToast);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        updatedAt: new Date()
      });
      
      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        unreadCount.value--;
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const clearNotifications = () => {
    notifications.value = [];
    unreadCount.value = 0;
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  const addNotification = async (notification) => {
    const authStore = useAuthStore();
    if (!authStore.user?.uid) return;

    try {
      const notificationsRef = collection(db, 'notifications');
      const newNotification = {
        userId: authStore.user.uid,
        message: notification.message,
        type: notification.type || 'info',
        read: false,
        createdAt: new Date()
      };

      await addDoc(notificationsRef, newNotification);
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  };

  const notifyNewProduct = async (product) => {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    const batch = writeBatch(db);
    const notificationsRef = collection(db, 'notifications');

    usersSnapshot.forEach((userDoc) => {
      if (userDoc.data().role === 'buyer') {
        const notificationRef = doc(notificationsRef);
        batch.set(notificationRef, {
          userId: userDoc.id,
          type: 'product',
          message: `New product added: ${product.name}`,
          read: false,
          createdAt: new Date(),
          productId: product.id
        });
      }
    });

    await batch.commit();
  };

  return {
    notifications,
    toasts,
    unreadCount,
    subscribeToNotifications,
    markAsRead,
    clearNotifications,
    addNotification,
    notifyNewProduct,
    addToast,
    removeToast
  };
}); 