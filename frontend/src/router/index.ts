import { createRouter, createWebHistory } from 'vue-router'
import CustomerView from '../views/CustomerView.vue';
import AdminView from '../views/AdminView.vue';
import HomeView from '../views/HomeView.vue'
import SignIn from '../components/SignIn.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Customer', component: CustomerView },
    {
      path: '/admin',
      component: AdminView,
      children: [
        { path: '', name: 'AdminSignIn', component: SignIn },
        { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.path.startsWith('/admin/dashboard')

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe() // prevent memory leaks
    if (requiresAuth && !user) {
      next('/admin') // redirect to sign-in
    } else {
      next()
    }
  })
})

export default router
