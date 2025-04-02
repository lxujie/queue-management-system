<!-- QueueManager.vue -->
<template>
  <div>
    <h2>Queue Manager</h2>
    <input v-model="name" placeholder="Enter name" />
    <input v-model="phone" placeholder="Enter phone number" />
    <button @click="joinQueue">Join Queue</button>

    <ul>
      <li v-for="item in queueList" :key="item.id">
        {{ item.name }} - {{ item.phone }} - {{ item.status }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQueueStore } from '@/stores/queuestore';

const queueStore = useQueueStore();

const name = ref('');
const phone = ref('');

async function joinQueue() {
  if (name.value.trim() && phone.value.trim()) {
    // This function should be updated in your queuestore to also add createdAt.
    await queueStore.addToQueue(name.value, phone.value);
    name.value = '';
    phone.value = '';
  }
}

onMounted(() => {
  queueStore.initQueueListener();
});

const queueList = queueStore.queueList;
</script>
