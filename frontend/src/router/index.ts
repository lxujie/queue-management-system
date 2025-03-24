import { createRouter, createWebHistory } from 'vue-router'
import CustomerView from '../views/CustomerView.vue';
import AdminView from '../views/AdminView.vue';
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Customer', component: CustomerView },
    { path: '/admin', name: 'Admin', component: AdminView },
  ],
})

export default router
