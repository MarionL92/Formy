import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const getUserId = () => {
  const user = auth.currentUser;
  return user?.uid || null;
};

export const getFavorites = async () => {
  const uid = getUserId();
  if (!uid) return [];

  const docRef = doc(db, "favorites", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().items || [] : [];
};

export const addFavorite = async (formation) => {
  const uid = getUserId();
  if (!uid) return;

  const docRef = doc(db, "favorites", uid);
  const existing = await getFavorites();
  const updated = [...existing, formation];

  await setDoc(docRef, { items: updated });
};

export const removeFavorite = async (titre) => {
  const uid = getUserId();
  if (!uid) return;

  const docRef = doc(db, "favorites", uid);
  const existing = await getFavorites();
  const updated = existing.filter((f) => f.titre !== titre);

  await setDoc(docRef, { items: updated });
};
