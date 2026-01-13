import "./admin.css";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export default function AdminDashboard() {
  const [escalations, setEscalations] = useState([]);

  useEffect(() => {
    loadEscalations();
  }, []);

  async function loadEscalations() {
    const q = query(
      collection(db, "escalated_queries"),
      where("status", "==", "open"),
      orderBy("timestamp", "desc")
    );

    const snap = await getDocs(q);
    setEscalations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function resolveEscalation(id) {
    await updateDoc(doc(db, "escalated_queries", id), {
      status: "resolved",
      resolvedAt: new Date(),
    });

    setEscalations((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <h2>Escalated Queries</h2>

      {escalations.map((q) => (
        <div key={q.id} style={{ border: "1px solid #ccc", padding: 10 }}>
          <p>
            <b>User:</b> {q.userEmail}
          </p>
          <p>
            <b>Question:</b> {q.question}
          </p>
          <p>
            <b>Reason:</b> {q.reason}
          </p>
          <p>
            <b>Confidence:</b> {q.confidence}
          </p>

          <button onClick={() => resolveEscalation(q.id)}>Mark Resolved</button>
        </div>
      ))}
    </div>
  );
}
