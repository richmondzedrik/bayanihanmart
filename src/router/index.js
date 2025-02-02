import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/services/firebase/config'
import { watch } from 'vue'
import Home from '../views/Home.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/seller/dashboard',
    name: 'SellerDashboard',
    component: () => import('../views/seller/DashboardView.vue'),
    meta: { requiresAuth: true, role: 'seller' }
  },
  {
    path: '/buyer/marketplace',
    name: 'BuyerMarketplace',
    component: () => import('../views/buyer/MarketplaceView.vue'),
    meta: { requiresAuth: true, role: 'buyer' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresRole = to.matched.some(record => record.meta.role);

  if (authStore.loading) {
    // If auth is still loading, wait for it
    watch(
      () => authStore.loading,
      (loading) => {
        if (!loading) {
          handleNavigation();
        }
      },
      { immediate: true }
    );
  } else {
    handleNavigation();
  }

  function handleNavigation() {
    if (requiresAuth && !authStore.user) {
      next('/login');
    } else if (requiresRole && authStore.user?.role !== to.meta.role) {
      next(authStore.user?.role === 'seller' ? '/seller/dashboard' : '/buyer/marketplace');
    } else if (to.path === '/login' && authStore.user) {
      next(authStore.user.role === 'seller' ? '/seller/dashboard' : '/buyer/marketplace');
    } else if (to.path === '/' && authStore.user) {
      // Allow authenticated users to access home page
      next();
    } else {
      next();
    }
  }
});

export default router
