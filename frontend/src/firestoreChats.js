import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* SAVE ALL CHATS */
export async function saveChats(uid, chats) {
  const chatsRef = collection(db, "users", uid, "chats");

  for (const chat of chats) {
    await setDoc(doc(chatsRef, String(chat.id)), {
      title: chat.title,
      messages: chat.messages,
      updatedAt: serverTimestamp(),
    });
  }
}

/* LOAD ALL CHATS */
export async function loadChats(uid) {
  const chatsRef = collection(db, "users", uid, "chats");
  const snapshot = await getDocs(chatsRef);

  const chats = [];
  snapshot.forEach((doc) => {
    chats.push({
      id: Number(doc.id),
      ...doc.data(),
    });
  });

  return chats;
}
