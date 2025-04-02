<template>
  <div>
    <AdminDashboard v-if="auth.isSignedIn" />
    <SignIn v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import SignIn from '../components/SignIn.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import { useAuthStore } from '../stores/authStore'  

const auth = useAuthStore() 

onMounted(() => {
  const firebaseAuth = getAuth()
  onAuthStateChanged(firebaseAuth, (user) => {
    auth.isSignedIn = !!user 
  })
})
</script>
