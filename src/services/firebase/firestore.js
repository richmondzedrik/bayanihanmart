import { db } from './config';
import { 
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export const firestoreService = {
  // Create or update user profile
  async setUserProfile(userId, data) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      throw error;
    }
  },

  // Create product
  async createProduct(productData) {
    try {
      const productsRef = collection(db, 'products');
      const newProductRef = doc(productsRef);
      await setDoc(newProductRef, {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return newProductRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get products by seller
  async getProductsBySeller(sellerId) {
    try {
      const q = query(
        collection(db, 'products'),
        where('sellerId', '==', sellerId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
};
