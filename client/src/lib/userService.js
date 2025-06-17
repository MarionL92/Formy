import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function saveUserProfile(uid, data) {
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, data, { merge: true }) // merge pour pas tout écraser
}

export async function getUserProfile(uid) {
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  return snap.exists() ? snap.data() : null
}
