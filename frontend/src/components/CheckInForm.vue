<!--<template>
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
</script>-->

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="name" placeholder="Your Name" required />
    <input v-model="reason" placeholder="Reason for Visit" required />
    <input v-model="phone" placeholder="Phone Number (+65...)" required />
    <button type="submit">Join Queue</button>
    <p v-if="success">✅ You're in the queue!</p>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { db } from '@/firebase';
  import { addDoc, collection, Timestamp } from 'firebase/firestore';

  // Form fields
  const name = ref('');
  const reason = ref('');
  const phone = ref('');
  const success = ref(false);

  const handleSubmit = async () => {
    if (!name.value || !reason.value || !phone.value) return;

    await addDoc(collection(db, 'queue'), {
      name: name.value,
      reason: reason.value,
      phone: phone.value,
      createdAt: Timestamp.now(),
      status: 'waiting'
    });

    // Reset form
    name.value = '';
    reason.value = '';
    phone.value = '';
    success.value = true;
  };
</script>

<style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #1e1e1e;
    padding: 24px;
    border-radius: 12px;
    max-width: 400px;
    margin: 0 auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  }

  input {
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
  }

  button {
    padding: 12px;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }

    button:hover {
      background-color: #2fa36a;
    }

  p {
    color: #81c784;
    font-weight: bold;
    margin-top: 10px;
    text-align: center;
  }
</style>
