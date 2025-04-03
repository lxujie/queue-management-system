<!-- PhoneQueueStatus.vue -->
<template>
    <div class="phone-check">
      <input v-model="phoneNumber" placeholder="Enter your phone number" />
      <button @click="checkQueue">Check Status</button>
      <div v-if="checked">
        <template v-if="foundItem">
          <p>You are in queue position: {{ queuePosition }}.</p>
          <p>Estimated waiting time: {{ estimatedWaitingTime }} minutes.</p>
        </template>
        <template v-else>
          <p>Your phone number is not currently in the queue.</p>
        </template>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useQueueStore } from '../stores/queuestore';
  
  const phoneNumber = ref('');
  const checked = ref(false);
  const foundItem = ref<any>(null);
  const queuePosition = ref(0);
  const estimatedWaitingTime = ref(0);
  
  const queueStore = useQueueStore();
  
  /**
  * Starts the queue listener on mount to ensure queue data stays updated in the store.
  */
  onMounted(() => {
    queueStore.initQueueListener();
  });

  /**
  * Checks the queue status based on the entered phone number.
  * - Filters the queue for users with 'waiting' status.
  * - Calculates the user's position in the queue.
  * - Estimates waiting time based on:
  *   - First person gets 5 minutes
  *   - Second person may wait less or default to 3 minutes if overdue
  *   - Others add 5 mins per person beyond the second
  */
  const checkQueue = () => {
    // Reset the display state.
    checked.value = false;
    foundItem.value = null;
  
    // Filter and sort waiting items.
    const waitingList = queueStore.queueList
      .filter(item => item.status === 'waiting')
      .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
      
    // Find the index of the entry matching the entered phone number.
    const index = waitingList.findIndex(item => item.phone === phoneNumber.value);
  
    if (index !== -1) {
      foundItem.value = waitingList[index];
    }
  
    // Compute the queue position.
    queuePosition.value = index !== -1 ? index + 1 : 0;
  
    // Compute the estimated waiting time.
    // Rules:
    // • Position 1: waiting time is 0.
    // • For Position 2:
    //    - If the first person hasn't completed 5 minutes, waiting time = 5 minutes - elapsed time.
    //    - If the first person is overdue (elapsed >= 5 minutes), reset to a 3-minute timer:
    //         waitingForSecond = max(3 - (elapsed beyond 5 minutes), 0)
    // • For Position ≥ 3: waiting time = waitingForSecond + 5 minutes * (number of extra slots beyond 2)
    if (index <= 0) {
      estimatedWaitingTime.value = 0;
    } else {
      const now = Date.now();
      const fiveMinutesMs = 5 * 60 * 1000;
      const firstItemTime = waitingList[0].createdAt.toMillis();
      const elapsed0 = now - firstItemTime;
      let waitingForSecond = 0;
  
      if (elapsed0 < fiveMinutesMs) {
        // Normal countdown for the first slot.
        waitingForSecond = 5 - (elapsed0 / 60000);
      } else {
        // First person is overdue; reset timer for second person to 3 minutes countdown.
        waitingForSecond = 3 - ((elapsed0 - fiveMinutesMs) / 60000);
        if (waitingForSecond < 0) waitingForSecond = 0;
      }
  
      if (index === 1) {
        estimatedWaitingTime.value = Math.ceil(waitingForSecond);
      } else {
        // For positions beyond the second, add 5 minutes for each extra slot.
        const extraSlots = index - 1;
        estimatedWaitingTime.value = Math.ceil(waitingForSecond + 5 * extraSlots);
      }
    }
  
    checked.value = true;
  };
  </script>
  
  <style scoped>
  .phone-check {
    padding: 1rem;
    margin-top: 1rem;
  }
  </style>
