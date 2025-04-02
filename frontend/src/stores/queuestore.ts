// queuestore.ts
import { defineStore } from 'pinia';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

interface QueueItem {
  id?: string;
  name: string;
  phone: string; // new property to store the phone number
  status: string; // "waiting" | "served"
}

export const useQueueStore = defineStore('queue', {
  state: () => ({
    queueList: [] as QueueItem[],
  }),
  actions: {
    async initQueueListener() {
      const queueRef = collection(db, 'queue');
      onSnapshot(queueRef, (snapshot) => {
        this.queueList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as QueueItem[];
      });
    },
    async addToQueue(name: string, phone: string) {
      const queueRef = collection(db, 'queue');
      await addDoc(queueRef, {
        name,
        phone,
        status: 'waiting',
      });
    },
  },
});
