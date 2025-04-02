// queuestore.ts
import { defineStore } from 'pinia';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

interface QueueItem {
  id?: string;
  name: string;
  phone: string;
  status: string; // "waiting" | "served"
  createdAt: any; // Firestore Timestamp (you might use a more specific type)
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
        createdAt: Timestamp.now(), // Log the entry time
      });
    },
  },
});
