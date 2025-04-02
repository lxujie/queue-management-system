<template>
  <div>
    <h1>Customer Check-In</h1>
    <CheckInForm />
    <QueueStatus v-if="auth.isSignedIn" />
  </div>
</template>

<script setup lang="ts">
import CheckInForm from '../components/CheckInForm.vue';
import QueueStatus from '../components/QueueStatus.vue';
import { useAuthStore } from '../stores/authstore';

const auth = useAuthStore();
</script>
