<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="name" placeholder="Your Name" required />
    <input v-model="reason" placeholder="Reason for Visit" required />
    <button type="submit">Join Queue</button>
    <p v-if="success">✅ You're in the queue!</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { db } from '@/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

const name = ref('');
const reason = ref('');
const success = ref(false);

const handleSubmit = async () => {
  await addDoc(collection(db, 'queue'), {
    name: name.value,
    reason: reason.value,
    createdAt: Timestamp.now(),
    status: 'waiting'
  });
  name.value = '';
  reason.value = '';
  success.value = true;
};
</script>
