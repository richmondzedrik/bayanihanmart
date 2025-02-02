import { defineStore } from 'pinia';
import { ref, onUnmounted } from 'vue';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth();
  const user = ref(null);
  const loading = ref(true);
  const error = ref(null);

  // Initialize auth state
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            user.value = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            };
          } else {
            // If no Firestore document exists, set basic user info
            const basicUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'buyer' // Default role
            };
            
            user.value = basicUserData;
            
            // Attempt to create Firestore document
            try {
              await setDoc(userDocRef, {
                ...basicUserData,
                createdAt: new Date()
              });
            } catch (setDocError) {
              console.warn('Failed to create user document:', setDocError);
              // Continue with basic user info
            }
          }
        } catch (firestoreError) {
          console.warn('Firestore fetch failed:', firestoreError);
          // Set basic user info from Firebase Auth and retry connection
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'buyer' // Default role
          };

          // Attempt to reconnect after a delay
          setTimeout(async () => {
            try {
              const retryDoc = await getDoc(userDocRef);
              if (retryDoc.exists()) {
                user.value = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  ...retryDoc.data()
                };
              }
            } catch (retryError) {
              console.warn('Retry fetch failed:', retryError);
            }
          }, 5000); // Retry after 5 seconds
        }
      } else {
        user.value = null;
      }
    } catch (e) {
      console.error('Auth state change error:', e);
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  });

  // Cleanup subscription on store destruction
  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });

  // Login
  async function login(email, password) {
    try {
      loading.value = true;
      error.value = null;
      
      // Add retry logic for emulator connection
      let retries = 3;
      while (retries > 0) {
        try {
          const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            user.value = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            };
          }
          return user.value;
        } catch (e) {
          if (e.code === 'auth/network-request-failed' && retries > 1) {
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw e;
        }
      }
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // Register
  async function register(email, password, userData) {
    try {
      loading.value = true;
      error.value = null;
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const userDocData = {
        ...userData,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        createdAt: new Date()
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);
      user.value = userDocData;
      return user.value;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // Logout
  async function logout() {
    try {
      await signOut(auth);
      user.value = null;
    } catch (e) {
      error.value = e.message;
      throw e;
    }
  }

  // Login with Google
  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile for Google sign-in
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: 'buyer', // Default role for Google sign-in
          createdAt: new Date()
        });
      }
      
      const userData = userDoc.exists() ? userDoc.data() : {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        role: 'buyer'
      };
      
      user.value = userData;
      return userData;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    loginWithGoogle
  };
});
