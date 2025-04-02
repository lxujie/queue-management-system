<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useAuthStore } from './stores/authstore'

const authStore = useAuthStore()

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    authStore.isSignedIn = !!user
    authStore.isAuthChecked = true
  })
})

</script>
<template>
  <div class="app-wrapper">
    <nav>
      <RouterLink to="/">Customer</RouterLink> |
      <RouterLink to="/admin">Admin</RouterLink>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  background-color: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
}

/* Logo */
.logo {
  margin-bottom: 1rem;
}

/* Nav */
nav {
  font-size: 1rem;
  margin-bottom: 2rem;
}

nav a {
  color: #42b883;
  text-decoration: none;
  padding: 0 12px;
  font-weight: 600;
}

nav a.router-link-exact-active {
  text-decoration: underline;
}

/* Responsive tweaks */
@media (min-width: 768px) {
  .app-wrapper {
    padding: 60px 40px;
  }

  .logo {
    width: 120px;
    height: 120px;
  }

  nav {
    font-size: 1.1rem;
  }
}
</style>
