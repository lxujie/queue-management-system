<template>
  <div>
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
          <button v-if="entry.status !== 'served'" @click="markServed(entry)">
            ✔ Mark Served
          </button>
          <button @click="removeEntry(entry.id)">🗑 Remove</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
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

const markServed = async (entry: any) => {
  try {
    console.log('User served:', entry);

    if (!entry || !entry.id) {
      console.error('Invalid entry passed to markServed:', entry);
      return;
    }

    const id = entry.id;
    await updateDoc(doc(db, 'queue', id), { status: 'served' });
    console.log('Status updated in Firestore for ID:', id);

    const phone = entry.phone;
    if (!phone) {
      console.warn('No phone number found. Skipping SMS.');
      return;
    }
    if (!phone.startsWith('+')) {
      console.error('Invalid phone number format (must start with +):', phone);
      return;
    }

    const payload = {
      phoneNumber: phone,
      message: `Hi ${entry.name}, it's your turn now! Please proceed to the counter.`,
    };
    console.log('Sending payload to /notifyUser:', payload);

    const response = await fetch('/.netlify/functions/notifyUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }
    if (!response.ok) {
      console.error('Failed to send SMS:', result);
      return;
    }
    console.log('Twilio SMS sent successfully:', result);
  } catch (err) {
    console.error('Error in markServed:', err);
  }
};

const removeEntry = async (id: string) => {
  await deleteDoc(doc(db, 'queue', id));
  console.log('User removed');
};
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
