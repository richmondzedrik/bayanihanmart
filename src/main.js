import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import './index.css'
import 'flowbite'
import { app as firebaseApp } from './services/firebase/config'

// Check Firebase initialization
if (!firebaseApp) {
  console.error('Firebase not initialized properly')
} else {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.mount('#app')
}
