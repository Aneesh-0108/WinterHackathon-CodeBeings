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

export default function AdminDashboard({ onLogout }) {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadEscalations();

    // 🔁 Auto refresh every 10 seconds (keeps dashboard fresh)
    const interval = setInterval(loadEscalations, 10000);
    return () => clearInterval(interval);
  }, []);

  async function loadEscalations() {
    try {
      const q = query(
        collection(db, "escalated_queries"),
        where("status", "==", "open")
      );

      const snap = await getDocs(q);
      setEscalations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Failed to load escalations", err);
      setError("Failed to load escalations");
    } finally {
      setLoading(false);
    }
  }

  async function resolveEscalation(id) {
    try {
      await updateDoc(doc(db, "escalated_queries", id), {
        status: "resolved",
        resolvedAt: new Date(),
      });

      // ✅ Instantly update UI
      setEscalations((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to resolve escalation:", err);
      alert("Failed to resolve escalation");
    }
  }

  function handleLogout() {
    localStorage.clear();

    if (typeof onLogout === "function") {
      onLogout(); // ✅ proper app routing
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Escalated Queries</h2>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-list">
        {loading && <p className="admin-empty">Loading escalations…</p>}

        {!loading && escalations.length === 0 && (
          <p className="admin-empty">No open escalations 🎉</p>
        )}

        {escalations.map((q) => (
          <div key={q.id} className="admin-card">
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

            <button onClick={() => resolveEscalation(q.id)}>
              Mark Resolved
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
