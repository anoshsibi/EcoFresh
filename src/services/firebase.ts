import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { UserCredential } from 'firebase/auth';

// Your web app's Firebase configuration
// Configuration for eco-fresh2255 project
const firebaseConfig = {
  apiKey: "AIzaSyCEhQXk7xbrkvd-slj4S8VfgYeCcpil6Cg",
  authDomain: "eco-fresh2255.firebaseapp.com",
  projectId: "eco-fresh2255",
  storageBucket: "eco-fresh2255.appspot.com",
  messagingSenderId: "347289442120",
  appId: "1:347289442120:web:384949dc512e3b632c857d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export { auth, db };