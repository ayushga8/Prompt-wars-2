import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQf-onP58YGl0uSMSLhUptEs13hQVYhYw",
  authDomain: "promptwars-2.firebaseapp.com",
  projectId: "promptwars-2",
  storageBucket: "promptwars-2.firebasestorage.app",
  messagingSenderId: "715657935538",
  appId: "1:715657935538:web:90b1669b25a08db5a567ab",
  measurementId: "G-RDSCN56FXE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
