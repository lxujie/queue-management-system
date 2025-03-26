<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="name" placeholder="Your Name" required />
    <input v-model="reason" placeholder="Reason for Visit" required />
    <input v-model="phone" placeholder="Phone Number (e.g. +6591234567)" required />
    <button type="submit" @click="logButtonClick">Join Queue</button>
    <p v-if="success">✅ You're in the queue!</p>
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { db } from '@/firebase';
  import { addDoc, collection, Timestamp } from 'firebase/firestore';

  const name = ref('');
  const reason = ref('');
  const phone = ref('');
  const success = ref(false);
  const error = ref('');

  const logButtonClick = () => {
    console.log('Join Queue button clicked');
  };

  const handleSubmit = async () => {
    console.log('handleSubmit triggered');

    // Validate Singapore number format
    if (!phone.value.startsWith('+65')) {
      error.value = 'Phone number must start with +65 (Singapore format)';
      console.warn('Invalid phone number:', phone.value);
      return;
    }

    error.value = '';

    try {
      console.log('Submitting to Firestore with:', {
        name: name.value,
        reason: reason.value,
        phone: phone.value
      });

      const docRef = await addDoc(collection(db, 'queue'), {
        name: name.value,
        reason: reason.value,
        phone: phone.value,
        createdAt: Timestamp.now(),
        status: 'waiting'
      });

      console.log('Document added to Firestore with ID:', docRef.id);

      // *** Uncomment this block if you want a message when you press Join Queue *** //
      //const response = await fetch('/.netlify/functions/notifyUser', {
      //  method: 'POST',
      //  headers: { 'Content-Type': 'application/json' },
      //  body: JSON.stringify({
      //    phoneNumber: phone.value,
      //    docId: docRef.id,
      //    type: 'join'
      //  })
      //});

      //const resultText = await response.text();
      //try {
      //  const result = JSON.parse(resultText);
      //  console.log('notifyUser response:', result);
      //} catch {
      //  console.warn('Response is not valid JSON:', resultText);
      //}
      // *** Uncomment this block if you want a message when you press Join Queue *** //

      name.value = '';
      reason.value = '';
      phone.value = '';
      success.value = true;
    } catch (error) {
      console.error('Error during form submission or notifyUser call:', error);
    }
  };
</script>
