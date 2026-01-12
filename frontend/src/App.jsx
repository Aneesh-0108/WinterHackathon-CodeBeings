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

  /* ======================
     RENAME
  ====================== */
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [hydrated, setHydrated] = useState(false);
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
     BROWSER NAV
  ====================== */
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state?.page) setPage(e.state.page);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /* ======================
     LOAD CHATS
  ====================== */
  useEffect(() => {
    if (!isLoggedIn || !username) return;

    const savedChats = localStorage.getItem(
      `cloud-companion-chats-${username}`
    );

    setChats(savedChats ? JSON.parse(savedChats) : []);
    setCurrentChatId(null);
    setHydrated(true);
  }, [isLoggedIn, username]);

  /* ======================
     SAVE CHATS
  ====================== */
  useEffect(() => {
    if (!hydrated || !username) return;

    localStorage.setItem(
      `cloud-companion-chats-${username}`,
      JSON.stringify(chats)
    );
  }, [chats, hydrated, username]);

  /* ======================
     SAVE THEME
  ====================== */
  useEffect(() => {
    localStorage.setItem("cloud-companion-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ======================
     AUTOSCROLL
  ====================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, loading]);

  /* ======================
     AUTH HANDLERS
  ====================== */
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
     CHAT HANDLERS
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

  function startRename(chat) {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  }

  function saveRename(chatId) {
    if (!editTitle.trim()) {
      setEditingChatId(null);
      return;
    }

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, title: editTitle.trim() } : c
      )
    );
    setEditingChatId(null);
  }

  /* ======================
     SEND MESSAGE (BACKEND)
  ====================== */
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
              messages: [
                ...c.messages,
                { sender: "bot", text: data.reply },
              ],
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

  /* ======================
     PAGE RENDERING
  ====================== */
  if (page === "home") {
    return (
      <div className="page fade-in">
        <Home
          onLoginClick={() => {
            setPage("login");
            window.history.pushState({ page: "login" }, "");
          }}
        />
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

  /* ======================
     CHAT UI
  ====================== */
  return (
    <div className={`layout fade-in ${darkMode ? "dark" : ""}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <span>{username}</span>
          <div className="sidebar-actions">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞" : "🌙"}
            </button>
            <button onClick={() => setConfirmLogout(true)}>Logout</button>
          </div>
        </div>

        <button onClick={createNewChat}>➕ New Chat</button>

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`history-item ${chat.id === currentChatId ? "active" : ""
              }`}
            onClick={() => setCurrentChatId(chat.id)}
          >
            {chat.title}
          </div>
        ))}
      </div>

      <div className="chat-container">
        <div className="messages">
          {!currentChat && (
            <div className="start-message">Create a new chat to start 💬</div>
          )}

          {currentChat &&
            currentChat.messages.map((m, i) => (
              <div key={i} className={`message ${m.sender}`}>
                {m.text}
              </div>
            ))}

          {loading && <div className="message bot">Typing...</div>}
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
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>

      {confirmLogout && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Logout?</p>
            <button onClick={handleLogoutConfirmed}>Yes</button>
            <button onClick={() => setConfirmLogout(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
