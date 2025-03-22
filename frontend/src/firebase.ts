import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBW2A5z6eXkilSpJL31eEQ482gWoyuEaAo",
    authDomain: "team-wooooof.firebaseapp.com",
    projectId: "team-wooooof",
    storageBucket: "team-wooooof.firebasestorage.app",
    messagingSenderId: "648939565858",
    appId: "1:648939565858:web:eea7f5da4faa3dd2e52b7b",
    measurementId: "G-X84GHMJ07J"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
// const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);