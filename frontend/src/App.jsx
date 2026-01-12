import { saveEscalatedQuery } from "./firestoreEscalations";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { loadChats, saveChats } from "./firestoreChats";

import { useState, useEffect, useRef } from "react";
import Home from "./Home";
import UserLogin from "./UserLogin";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

function App() {
  /* ======================
     PAGE STATE
  ====================== */
  const [page, setPage] = useState("home");

  /* ======================
     AUTH
  ====================== */
  const [username, setUsername] = useState("");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* ======================
     CHAT
  ====================== */
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     UI
  ====================== */
  const [darkMode, setDarkMode] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const messagesEndRef = useRef(null);
  const currentChat = chats.find((c) => c.id === currentChatId);

  /* ======================
     LOAD THEME
  ====================== */
  useEffect(() => {
    const savedTheme = localStorage.getItem("cloud-companion-theme");
    if (savedTheme) setDarkMode(savedTheme === "dark");
  }, []);

  /* ======================
     FIREBASE AUTH LISTENER
  ====================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setUsername(user.displayName || user.email);
        setPage("chat");

        // 🔥 LOAD CHATS FROM FIRESTORE
        const savedChats = await loadChats(user.uid);
        if (savedChats.length > 0) {
          setChats(savedChats);
          setCurrentChatId(savedChats[0].id);
        }

        localStorage.setItem("cc-user", user.email);
        window.history.replaceState({ page: "chat" }, "");
      } else {
        setFirebaseUser(null);
        setChats([]);
        setCurrentChatId(null);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ======================
     SAVE CHATS TO FIRESTORE
  ====================== */
  useEffect(() => {
    if (firebaseUser && chats.length > 0) {
      saveChats(firebaseUser.uid, chats);
    }
  }, [chats, firebaseUser]);

  /* ======================
     AUTOSCROLL
  ====================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, loading]);

  /* ======================
     LOGIN / LOGOUT
  ====================== */
  function handleLogin(user) {
    setUsername(user);
    setPage("chat");
    window.history.pushState({ page: "chat" }, "");
  }

  function handleLogoutConfirmed() {
    localStorage.clear();
    setPage("home");
    window.history.pushState({ page: "home" }, "");
  }

  /* ======================
     CHAT ACTIONS
  ====================== */
  function createNewChat() {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  }

  function deleteChatConfirmed() {
    setChats((prev) => prev.filter((c) => c.id !== chatToDelete));
    if (chatToDelete === currentChatId) setCurrentChatId(null);
    setChatToDelete(null);
  }

  async function sendMessage() {
    if (!input.trim() || !currentChat) return;

    const text = input;
    setInput("");
    setLoading(true);

    // add user message
    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? { ...c, messages: [...c.messages, { sender: "user", text }] }
          : c
      )
    );

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      // add bot reply
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: [...c.messages, { sender: "bot", text: data.reply }],
              }
            : c
        )
      );

      // 🔥 ESCALATION HANDLING
      if (data.escalated === true) {
        await saveEscalatedQuery({
          question: text,
          reply: data.reply,
          confidence: data.confidence,
          reason: data.reason || "unknown",
          user: firebaseUser,
        });
      }
    } catch (err) {
      console.error(err);
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { sender: "bot", text: "⚠️ Server error" },
                ],
              }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  }

  /* ======================
     ROUTING
  ====================== */
  if (authLoading) {
    return <div style={{ padding: 20 }}>Checking login…</div>;
  }

  if (page === "home") {
    return (
      <Home
        onLoginClick={() => {
          setPage("user-login");
          window.history.pushState({ page: "user-login" }, "");
        }}
      />
    );
  }

  if (page === "user-login") {
    return (
      <UserLogin
        onUserLogin={() => handleLogin("user")}
        onAdminClick={() => {
          setPage("login");
          window.history.pushState({ page: "login" }, "");
        }}
      />
    );
  }

  if (page === "login") return <Login onLogin={handleLogin} />;
  if (page === "admin") return <AdminDashboard />;

  /* ======================
     CHAT UI
  ====================== */
  return (
    <div className={`layout fade-in ${darkMode ? "dark" : ""}`}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <span>{username}</span>

          <div className="sidebar-actions">
            <button
              className="icon-btn"
              onClick={() => {
                const next = !darkMode;
                setDarkMode(next);
                localStorage.setItem(
                  "cloud-companion-theme",
                  next ? "dark" : "light"
                );
              }}
            >
              {darkMode ? "🌞" : "🌙"}
            </button>

            <button
              className="logout-btn"
              onClick={() => setConfirmLogout(true)}
            >
              Logout
            </button>
          </div>
        </div>

        <button className="menu-btn" onClick={createNewChat}>
          ➕ New Chat
        </button>

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`history-item ${
              chat.id === currentChatId ? "active" : ""
            }`}
            onClick={() => setCurrentChatId(chat.id)}
          >
            <span style={{ flex: 1, textAlign: "center" }}>{chat.title}</span>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                setChatToDelete(chat.id);
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="chat-container">
        <div className="messages">
          {currentChat?.messages.map((m, i) => (
            <div key={i} className={`message ${m.sender}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="message bot">Typing…</div>}
          <div ref={messagesEndRef} />
        </div>

        {currentChat && (
          <div className="input-box">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button className="send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        )}
      </div>

      {/* LOGOUT MODAL */}
      {confirmLogout && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Logout?</p>
            <button onClick={handleLogoutConfirmed}>Yes</button>
            <button onClick={() => setConfirmLogout(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {chatToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete this chat?</p>
            <button onClick={deleteChatConfirmed}>Delete</button>
            <button onClick={() => setChatToDelete(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
