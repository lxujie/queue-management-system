// stores/authstore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isSignedIn = ref(false);
  const isAuthChecked = ref(false); 

  return { isSignedIn, isAuthChecked };
});
