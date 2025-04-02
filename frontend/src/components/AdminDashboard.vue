<template>
  <div>
    <h2>Welcome to Admin Dashboard</h2>
    <!-- Display empty message if no queue items -->
    <div v-if="queue.length === 0" class="empty-message">
      Currently no one in queue.
    </div>

    <!-- Otherwise display the list of queue items -->
    <ul v-else>
      <li v-for="entry in queue" :key="entry.id" class="queue-item">
        <div class="entry-info">
          <span class="entry-name">{{ entry.name }}</span>
          <span class="entry-phone">({{ entry.phone }})</span> –
          <span class="entry-reason">{{ entry.reason }}</span> –
          <span class="status" :class="entry.status">{{ entry.status }}</span>
        </div>
        <div class="action-buttons">
          <!-- Pass full entry object -->
          <button v-if="entry.status === 'waiting'" @click="notifyReady(entry)">
            📲 Ready to Serve
          </button>
          <button v-if="entry.status !== 'served'" @click="markServed(entry)">
            ✔ Mark Served
          </button>
          <button @click="removeEntry(entry.id)">🗑 Remove</button>
        </div>
      </li>
    </ul>
    <button @click="signOutUser">Sign Out</button>
  </div>
</template>

<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const router = useRouter()
const auth = getAuth()
const queue = ref<any[]>([]);

// Realtime Firestore listener
onMounted(() => {
  const q = query(collection(db, 'queue'), orderBy('createdAt'));
  onSnapshot(q, (snapshot) => {
    queue.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  });
});

const notifyReady = async (entry: any) => {
  try {
    if (!entry || !entry.id || !entry.phone) {
      console.warn('Missing entry or phone number');
      return;
    }

    if (!entry.phone.startsWith('+')) {
      console.error('Phone number must start with +');
      return;
    }

    const payload = {
      phoneNumber: entry.phone,
      message: `Hi ${entry.name}, you're next! Please head over to the counter.`,
    };

    console.log('Sending ready-to-serve SMS:', payload);

    const response = await fetch('/.netlify/functions/notifyUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const resultText = await response.text();
    try {
      const result = JSON.parse(resultText);
      console.log('Twilio SMS sent:', result);
    } catch {
      console.warn('SMS response was not JSON:', resultText);
    }
  } catch (err) {
    console.error('Error in notifyReady:', err);
  }
};

const markServed = async (entry: any) => {
  try {
    if (!entry || !entry.id) return;
    await updateDoc(doc(db, 'queue', entry.id), { status: 'served' });
    console.log('Marked as served:', entry.id);
  } catch (err) {
    console.error('Error in markServed:', err);
  }
};

const removeEntry = async (id: string) => {
  await deleteDoc(doc(db, 'queue', id));
  console.log('User removed');
};

function signOutUser() {
  signOut(auth).then(() => {
    router.push('/admin') // Go back to Sign In page
  }).catch((error) => {
    console.error('Sign out error:', error)
  })
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

.queue-item {
  background-color: #1e1e1e;
  padding: 16px 20px;
  margin-bottom: 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.entry-info {
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}

/* New style for displaying phone number */
.entry-phone {
  font-style: italic;
  color: #b0b0b0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.status {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.status.waiting {
  background-color: #ffb74d;
  color: #000;
}

.status.served {
  background-color: #81c784;
  color: #000;
}

button {
  padding: 10px 14px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2fa36a;
}

/* Style for empty queue message */
.empty-message {
  font-size: 18px;
  color: #ffffff;
  text-align: center;
  margin: 20px 0;
}
</style>
