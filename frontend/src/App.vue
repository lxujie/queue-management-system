<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-wrapper">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="100" height="100" />

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
