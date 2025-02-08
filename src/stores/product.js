import { defineStore } from 'pinia';
import { ref } from 'vue';
import { firestoreService } from '@/services/firebase/firestore';
import { collection, getDocs, getDoc, doc, updateDoc, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { useNotificationStore } from '@/stores/notification';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch seller's products
  async function fetchSellerProducts(sellerId) {
    try {
      loading.value = true;
      error.value = null;
      products.value = await firestoreService.getProductsBySeller(sellerId);
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // Create new product
  const createProduct = async (productData) => {
    try {
      loading.value = true;
      error.value = null;
      const productId = await firestoreService.createProduct(productData);
      
      // Add notification for new product
      const notificationStore = useNotificationStore();
      await notificationStore.notifyNewProduct({
        id: productId,
        ...productData
      });
      
      await fetchSellerProducts(productData.sellerId);
      return productId;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fetchProducts = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const q = query(collection(db, 'products'));
      return onSnapshot(q, async (snapshot) => {
        const productsWithSellers = await Promise.all(
          snapshot.docs.map(async (productDoc) => {
            const product = { id: productDoc.id, ...productDoc.data() };
            const sellerRef = doc(db, 'users', product.sellerId);
            const sellerDoc = await getDoc(sellerRef);
            return {
              ...product,
              seller: sellerDoc.exists() ? sellerDoc.data() : null
            };
          })
        );
        products.value = productsWithSellers;
        loading.value = false;
      });
    } catch (e) {
      error.value = e.message;
      loading.value = false;
      throw e;
    }
  };

  async function updateSellerDisasterStatus(sellerId, isDisasterAffected) {
    try {
      loading.value = true;
      error.value = null;
      await updateDoc(doc(db, 'users', sellerId), {
        isDisasterAffected,
        updatedAt: new Date()
      });
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function getProductsBySeller(sellerId) {
    try {
      loading.value = true;
      error.value = null;
      products.value = await firestoreService.getProductsBySeller(sellerId);
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateProduct(productId, productData) {
    try {
      loading.value = true;
      error.value = null;
      await firestoreService.updateProduct(productId, productData);
      await fetchSellerProducts(productData.sellerId);
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const getAllProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      
      products.value = products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  async function updateProductStock(productId, newStock) {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        stock: newStock
      });
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchSellerProducts,
    createProduct,
    updateProduct,
    getProductsBySeller,
    updateSellerDisasterStatus,
    getAllProducts,
    updateProductStock
  };
});
