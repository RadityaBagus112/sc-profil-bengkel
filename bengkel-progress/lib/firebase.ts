import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCVkd1084xiAQxwK6ZqNYtBpTlUeJKorMo',
  authDomain: 'bengkel-progress.firebaseapp.com',
  projectId: 'bengkel-progress',
  storageBucket: 'bengkel-progress.firebasestorage.app',
  messagingSenderId: '55239380236',
  appId: '1:55239380236:web:79fbaf1c478ae2e2198d29',
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
