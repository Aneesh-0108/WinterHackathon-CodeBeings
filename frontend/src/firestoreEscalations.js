import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function saveEscalatedQuery({
  question,
  reply,
  confidence,
  reason,
  user,
}) {
  if (!user) return;

  await addDoc(collection(db, "escalated_queries"), {
    question,
    reply,
    confidence,
    reason,
    userId: user.uid,
    userEmail: user.email,
    status: "open",
    timestamp: serverTimestamp(),
  });
}
