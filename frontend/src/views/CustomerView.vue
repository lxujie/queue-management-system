<template>
  <div>
    <h1>Customer Check-In</h1>
    <CheckInForm />
    <!-- Display QueueStatus only if the user is signed in -->
    <QueueStatus v-if="auth.isSignedIn" />
  </div>
</template>

<script setup lang="ts">
import CheckInForm from '../components/CheckInForm.vue';
import QueueStatus from '../components/QueueStatus.vue';
import { useAuthStore } from '../stores/authStore';

const auth = useAuthStore();
</script>
