<!-- QueueStatus.vue -->
<template>
  <div>
    <h2>Current Queue</h2>
    <ul>
      <li v-for="entry in queue" :key="entry.id">
        {{ entry.name }} – {{ entry.reason }}
        <span :class="['status', entry.status]">{{ entry.status }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { db } from '@/firebase';
  import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';

  const queue = ref<any[]>([]);

  /**
  * Starts a real-time listener on Firestore's 'queue' collection,
  * sorted by 'createdAt'. Updates the local `queue` array with
  * all entries to display current queue state.
  */
  onMounted(() => {
    const q = query(collection(db, 'queue'), orderBy('createdAt'));
    onSnapshot(q, (snapshot) => {
      queue.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  });
</script>
