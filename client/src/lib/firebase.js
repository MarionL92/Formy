// src/lib/firebase.js
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC52OVfxtaeJQu-F9unoyVJSUQ9oJXGDEo",
  authDomain: "formy-1bbc6.firebaseapp.com",
  projectId: "formy-1bbc6",
  storageBucket: "formy-1bbc6.appspot.com", // ✅ CORRECT
  messagingSenderId: "15135749904",
  appId: "1:15135749904:web:de341911e0235e92a79795",
  measurementId: "G-LHKVC19KQX"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
