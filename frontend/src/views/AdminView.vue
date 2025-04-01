<template>
  <div>
    <AdminDashboard v-if="isSignedIn" />
    <SignIn v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import SignIn from '../components/SignIn.vue'
import AdminDashboard from '../components/AdminDashboard.vue'

const isSignedIn = ref(false)
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    isSignedIn.value = !!user
  })
})
</script>
