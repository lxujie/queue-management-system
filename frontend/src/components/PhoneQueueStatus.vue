<!-- PhoneQueueStatus.vue -->
<template>
    <div class="phone-check">
      <input v-model="phoneNumber" placeholder="Enter your phone number" />
      <button @click="checkQueue">Check Status</button>
      <div v-if="foundItem">
        <p>You are in queue position: {{ position }}.</p>
        <p>Estimated waiting time: {{ waitingTime }} minutes.</p>
      </div>
      <div v-else-if="checked">
        <p>Your phone number is not currently in the queue.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useQueueStore } from '../stores/queuestore';
  
  const phoneNumber = ref('');
  const checked = ref(false);
  const foundItem = ref<any>(null);
  onMounted(() => {
   queueStore.initQueueListener();
  });
  
  const queueStore = useQueueStore();
  
  const checkQueue = () => {
    checked.value = false;
    foundItem.value = null;
    // Look for an entry where the phone field matches the input and status is 'waiting'
    const index = queueStore.queueList.findIndex(
      (item) => item.phone === phoneNumber.value && item.status === 'waiting'
    );
    if (index !== -1) {
      foundItem.value = queueStore.queueList[index];
    }
    checked.value = true;
  };
  
  const position = computed(() => {
    if (!foundItem.value) return 0;
    // Determine the position in the waiting list by counting how many waiting items precede the one with the matching phone number.
    return (
      queueStore.queueList.filter((item) => item.status === 'waiting')
        .findIndex((item) => item.phone === phoneNumber.value) + 1
    );
  });
  
  const waitingTime = computed(() => {
    // Each person ahead adds 5 minutes.
    return position.value > 0 ? (position.value - 1) * 5 : 0;
  });
  </script>
  
  <style scoped>
  .phone-check {
    border: 1px solid #ccc;
    padding: 1rem;
    margin-top: 1rem;
  }
  </style>
  