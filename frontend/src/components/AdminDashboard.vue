<!-- AdminDashboard.vue -->
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
          <div v-if="entry.status === 'waiting'" class="ready-group">
            <button :disabled="readyCooldowns[entry.id]"
                    @click="notifyReady(entry)">
              📲 Ready to Serve
            </button>
            <span v-if="readyNotifications[entry.id]" class="notification">
              Message sent!
            </span>
          </div>
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

  // Stores live queue data
  const queue = ref<any[]>([]);

  // New reactive objects to track cooldown state and notifications for each entry
  const readyCooldowns = ref<Record<string, boolean>>({});
  const readyNotifications = ref<Record<string, boolean>>({});

  /**
  * Initializes a real-time Firestore listener for the 'queue' collection,
  * ordered by 'createdAt'. Updates the local `queue` array whenever changes occur.
  */
  onMounted(() => {
    const q = query(collection(db, 'queue'), orderBy('createdAt'));
    onSnapshot(q, (snapshot) => {
      queue.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  });

  /**
  * Sends a "Ready to Serve" SMS message via Twilio (through Netlify Function)
  * to the given queue entry. Implements a 10-second cooldown and shows feedback UI.
  *
  * param entry - The queue entry object containing name, phone, and id.
  */
  const notifyReady = async (entry: any) => {
    // If button is on cooldown, do nothing.
    if (readyCooldowns.value[entry.id]) return;

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

      // Show "Message sent!" notification and start a 10s cooldown
      readyNotifications.value[entry.id] = true;
      readyCooldowns.value[entry.id] = true;
      setTimeout(() => {
        readyNotifications.value[entry.id] = false;
        readyCooldowns.value[entry.id] = false;
      }, 10000);
    } catch (err) {
      console.error('Error in notifyReady:', err);
    }
  };

  /**
  * Marks a given queue entry as "served" by updating its Firestore document.
  *
  * param entry - The queue entry to mark as served.
  */
  const markServed = async (entry: any) => {
    try {
      if (!entry || !entry.id) return;
      await updateDoc(doc(db, 'queue', entry.id), { status: 'served' });
      console.log('Marked as served:', entry.id);
    } catch (err) {
      console.error('Error in markServed:', err);
    }
  };

  /**
  * Removes the specified queue entry from the Firestore collection.
  *
  * param id - The Firestore document ID of the entry to remove.
  */
  const removeEntry = async (id: string) => {
    await deleteDoc(doc(db, 'queue', id));
    console.log('User removed');
  };

  /**
  * Signs out the currently authenticated admin user using Firebase Auth
  * and redirects them to the /admin login page.
  */
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

  .ready-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .notification {
    color: #81c784;
    font-weight: bold;
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

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
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
