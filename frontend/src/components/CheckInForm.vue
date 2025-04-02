<template>
  <div class="check-in-form">
    <form @submit.prevent="handleSubmit">
      <input v-model="name" placeholder="Your Name" required />
      <input v-model="reason" placeholder="Reason for Visit" required />
      <input
        v-model="phone"
        placeholder="Phone Number (e.g. +6591234567)"
        required
      />
      <button type="submit" @click="logButtonClick" :disabled="isSubmitting">
        Join Queue
      </button>
      <p v-if="success">✅ You're in the queue!</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <div class="queue-count">
      <p>Current number of people in queue: {{ queueCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
  getDocs
} from 'firebase/firestore';

const name = ref('');
const reason = ref('');
const phone = ref('');
const success = ref(false);
const error = ref('');
const queueCount = ref(0);
const isSubmitting = ref(false);

const logButtonClick = () => {
  console.log('Join Queue button clicked');
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  console.log('handleSubmit triggered');

  // Validate Singapore number format
  const singaporePhoneRegex = /^\+65\d{8}$/;
if (!singaporePhoneRegex.test(phone.value)) {
  error.value = 'Phone number must be in the format +65XXXXXXXX (8 digits)';
  console.warn('Invalid phone number:', phone.value);
  isSubmitting.value = false;
  return;
}


  error.value = '';
  try {
    // Check if this phone number already exists in the database
    const phoneQuery = query(
      collection(db, 'queue'),
      where('phone', '==', phone.value)
    );
    const querySnapshot = await getDocs(phoneQuery);
    if (querySnapshot.size > 0) {
      error.value = 'This phone number has already joined the queue.';
      isSubmitting.value = false;
      return;
    }

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

    // Optionally notify via Twilio on join
    const response = await fetch('/.netlify/functions/notifyUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: phone.value,
        docId: docRef.id,
        type: 'join'
      })
    });

    const resultText = await response.text();
    try {
      const result = JSON.parse(resultText);
      console.log('notifyUser response:', result);
    } catch {
      console.warn('Response is not valid JSON:', resultText);
    }

    // Clear the form and show success message immediately
    name.value = '';
    reason.value = '';
    phone.value = '';
    success.value = true;
  } catch (err) {
    console.error('Error during form submission or notifyUser call:', err);
    error.value = 'An error occurred during submission. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  // Listen to queue entries with status 'waiting' to update the count
  const q = query(
    collection(db, 'queue'),
    where('status', '==', 'waiting')
  );
  onSnapshot(q, (snapshot) => {
    queueCount.value = snapshot.size;
  });
});
</script>

<style scoped>
.check-in-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 8px;
  font-size: 16px;
}

button {
  padding: 10px 14px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #2fa36a;
}

.queue-count {
  font-size: 18px;
  color: #FFF;
  text-align: center;
}

.error {
  color: red;
}
</style>
