import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/services/firebase/config';
import { collection, onSnapshot, query, where, orderBy, doc, updateDoc, addDoc, getDocs, writeBatch } from 'firebase/firestore';
import { useAuthStore } from './auth';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([]);
  const unreadCount = ref(0);
  let unsubscribe = null;

  const subscribeToNotifications = () => {
    const authStore = useAuthStore();
    if (!authStore.user?.uid) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', authStore.user.uid),
      orderBy('createdAt', 'desc')
    );

    notifications.value = [];
    unreadCount.value = 0;

    unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const notification = {
          id: change.doc.id,
          ...change.doc.data(),
          createdAt: change.doc.data().createdAt?.toDate()
        };

        if (change.type === 'added') {
          const existingIndex = notifications.value.findIndex(n => n.id === notification.id);
          if (existingIndex === -1) {
            notifications.value.unshift(notification);
            if (!notification.read) {
              unreadCount.value++;
            }
          }
        } else if (change.type === 'modified') {
          const index = notifications.value.findIndex(n => n.id === notification.id);
          if (index !== -1) {
            const wasUnread = !notifications.value[index].read;
            const isNowRead = notification.read;
            if (wasUnread && isNowRead) {
              unreadCount.value = Math.max(0, unreadCount.value - 1);
            }
            notifications.value[index] = notification;
          }
        }
      });
    });

    return unsubscribe;
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        updatedAt: new Date()
      });
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
        userId: notification.userId || authStore.user.uid,
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
    unreadCount,
    subscribeToNotifications,
    markAsRead,
    clearNotifications,
    addNotification,
    notifyNewProduct
  };
}); 