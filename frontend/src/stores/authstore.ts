// stores/authStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isSignedIn = ref(false);
  return { isSignedIn };
});
