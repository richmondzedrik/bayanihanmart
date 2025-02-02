import { defineStore } from 'pinia';
import { ref } from 'vue';
import { firestoreService } from '@/services/firebase/firestore';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

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
  async function createProduct(productData) {
    try {
      loading.value = true;
      error.value = null;
      const productId = await firestoreService.createProduct(productData);
      await fetchSellerProducts(productData.sellerId);
      return productId;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const fetchProducts = async () => {
    try {
      loading.value = true;
      error.value = null;
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsWithSellers = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const product = { id: doc.id, ...doc.data() };
          const sellerDoc = await getDoc(doc(db, 'users', product.sellerId));
          return {
            ...product,
            seller: sellerDoc.exists() ? sellerDoc.data() : null
          };
        })
      );
      products.value = productsWithSellers;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchSellerProducts,
    createProduct
  };
});
