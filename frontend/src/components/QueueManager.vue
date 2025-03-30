<template>
  <div>
    <h2>Queue Manager</h2>
    <input v-model="name" placeholder="Enter name" />
    <button @click="joinQueue">Join Queue</button>

    <ul>
      <li v-for="item in queueList" :key="item.id">
        {{ item.name }} - {{ item.status }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQueueStore } from '@/stores/queueStore';

const queuestore = useQueueStore();

const name = ref('');

function joinQueue() {
  if (name.value.trim()) {
    queuestore.addToQueue(name.value);
    name.value = '';
  }
}

onMounted(() => {
  queuestore.initQueueListener();
});

const queueList = queuestore.queueList;
</script>
