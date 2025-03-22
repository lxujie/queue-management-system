import { defineStore } from 'pinia';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, /*DocumentData*/ } from 'firebase/firestore';

interface QueueItem {
  id?: string;
  name: string;
  status: string; // "waiting" | "served"
}

export const useQueueStore = defineStore('queue', {
  state: () => ({
    queueList: [] as QueueItem[],
  }),
  actions: {
    async initQueueListener() {
      const queueRef = collection(db, 'queues');
      onSnapshot(queueRef, (snapshot) => {
        this.queueList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as QueueItem[];
      });
    },
    async addToQueue(name: string) {
      const queueRef = collection(db, 'queues');
      await addDoc(queueRef, {
        name,
        status: 'waiting',
      });
    },
  },
});