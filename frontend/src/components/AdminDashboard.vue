<template>
  <div>
    <ul>
      <li v-for="entry in queue" :key="entry.id" class="queue-item">
        <div class="entry-info">
          <span class="entry-name">{{ entry.name }}</span> –
          <span class="entry-reason">{{ entry.reason }}</span> –
          <span class="status" :class="entry.status">{{ entry.status }}</span>
        </div>
        <div class="action-buttons">
          <button v-if="entry.status !== 'served'" @click="markServed(entry.id)">✔ Mark Served</button>
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

onMounted(() => {
  const q = query(collection(db, 'queue'), orderBy('createdAt'));
  onSnapshot(q, (snapshot) => {
    queue.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
});

const markServed = async (id: string) => {
  await updateDoc(doc(db, 'queue', id), { status: 'served' });
};

const removeEntry = async (id: string) => {
  await deleteDoc(doc(db, 'queue', id));
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
</style>
