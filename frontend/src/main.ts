import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#app');