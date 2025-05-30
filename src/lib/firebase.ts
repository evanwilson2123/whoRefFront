
// src/firebase.ts
import { initializeApp } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    type User as FirebaseUser,
} from "firebase/auth";
import { writable, type Writable } from "svelte/store";

// ← replace with your Firebase Web config
const firebaseConfig = {
    apiKey: "AIzaSyCXRtbgDS4KKqU9ChIaecn6EZmzNf-l9UE",
    authDomain: "whoref-78c99.firebaseapp.com",
    projectId: "whoref-78c99",
    storageBucket: "whoref-78c99.firebasestorage.app",
    messagingSenderId: "751189473143",
    appId: "1:751189473143:web:2ac16643c9007654645372",
    measurementId: "G-7DXNWQPW6F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// A Svelte store with the current FirebaseUser or null
export const user: Writable<FirebaseUser | null> = writable(null);
onAuthStateChanged(auth, (u) => {
    user.set(u);
});

// Expose auth helpers
export const login = (email: string, pw: string) =>
    signInWithEmailAndPassword(auth, email, pw);

export const signup = (email: string, pw: string) =>
    createUserWithEmailAndPassword(auth, email, pw);

export const logout = () => signOut(auth);
