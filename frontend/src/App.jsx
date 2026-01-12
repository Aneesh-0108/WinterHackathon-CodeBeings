import { useState, useEffect, useRef } from "react";
import Home from "./Home";
import Login from "./Login";

function App() {
  /* ======================
     PAGE STATE
  ====================== */
  const [page, setPage] = useState("home");

  /* ======================
     AUTH
  ====================== */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

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
     LOAD SESSION
  ====================== */
  useEffect(() => {
    const savedUser = localStorage.getItem("cc-user");
    const savedTheme = localStorage.getItem("cloud-companion-theme");

    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
      setPage("chat");
      window.history.replaceState({ page: "chat" }, "");
    } else {
      window.history.replaceState({ page: "home" }, "");
    }

    if (savedTheme) setDarkMode(savedTheme === "dark");
  }, []);

  /* ======================
     AUTOSCROLL
  ====================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, loading]);

  function handleLogin(user) {
    localStorage.setItem("cc-user", user);
    setUsername(user);
    setIsLoggedIn(true);
    setPage("chat");
    window.history.pushState({ page: "chat" }, "");
  }

  function handleLogoutConfirmed() {
    localStorage.removeItem("cc-user");
    setIsLoggedIn(false);
    setUsername("");
    setChats([]);
    setCurrentChatId(null);
    setConfirmLogout(false);
    setPage("home");
    window.history.pushState({ page: "home" }, "");
  }

  /* ======================
     ADD CHAT
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

  /* ======================
     DELETE CHAT
  ====================== */
  function deleteChat(chatId) {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (chatId === currentChatId) setCurrentChatId(null);
  }

  async function sendMessage() {
    if (!input.trim() || !currentChat) return;

    const userText = input;

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: [...c.messages, { sender: "user", text: userText }],
            }
          : c
      )
    );

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

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
    } catch {
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    sender: "bot",
                    text: "⚠️ Unable to reach server. Please try again.",
                  },
                ],
              }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  }

  if (page === "home") {
    return (
      <div className="page fade-in">
        <Home onLoginClick={() => setPage("login")} />
      </div>
    );
  }

  if (page === "login") {
    return (
      <div className="page fade-in">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className={`layout fade-in ${darkMode ? "dark" : ""}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <span>{username}</span>
          <div className="sidebar-actions">
            {/* ✅ FIX 1: Day/Night button polish */}
            <button
              className="icon-btn"
              onClick={() => setDarkMode(!darkMode)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: darkMode ? "#1f2937" : "#111827",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
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
            {chat.title}
            <span
              style={{ marginLeft: 8, cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
            >
              🗑️
            </span>
          </div>
        ))}
      </div>

      <div className="chat-container">
        <div className="messages">
          {currentChat?.messages.map((m, i) => (
            <div key={i} className={`message ${m.sender}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="message bot">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        {currentChat && (
          <div className="input-box">
            {/* ✅ FIX 2: Cursor vertical alignment */}
            <textarea
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{
                height: "48px",
                padding: "12px 14px",
                lineHeight: "24px",
                fontSize: "16px",
                resize: "none",
              }}
            />
            <button className="send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        )}
      </div>

      {confirmLogout && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Logout?</p>
            <button className="menu-btn" onClick={handleLogoutConfirmed}>
              Yes
            </button>
            <button
              className="logout-btn"
              onClick={() => setConfirmLogout(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
