import { useState, useEffect, useRef } from "react";
import Home from "./Home";
import Login from "./Login";

function App() {
  /* ======================
     PAGE STATE (NO ROUTER)
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
     BROWSER BACK / FORWARD
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
      prev.map((c) => (c.id === chatId ? { ...c, title: editTitle.trim() } : c))
    );

    setEditingChatId(null);
  }

  /* ======================
     SEND MESSAGE (DEMO)
  ====================== */
  function sendMessage() {
    if (!input.trim() || !currentChat) return;

    const userMsg = { sender: "user", text: input };

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? { ...c, messages: [...c.messages, userMsg] }
          : c
      )
    );

    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: "🤖 Backend integration coming next.",
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, botReply] }
            : c
        )
      );

      setLoading(false);
    }, 600);
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
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <span>{username}</span>

          <div className="sidebar-actions">
            <button
              className="dark-toggle"
              onClick={() => setDarkMode(!darkMode)}
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
            <div className="chat-title">{chat.title}</div>

            <button
              className="rename-btn"
              onClick={(e) => {
                e.stopPropagation();
                startRename(chat);
              }}
            >
              ✏️
            </button>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                setChatToDelete(chat);
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="chat-container">
        <div className={`messages ${!currentChat ? "empty-state" : ""}`}>
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
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  160
                )}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                  e.target.style.height = "48px";
                }
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>

      {/* LOGOUT MODAL */}
      {confirmLogout && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleLogoutConfirmed}>
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setConfirmLogout(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {chatToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete this chat?</p>
            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={() => {
                  setChats((prev) =>
                    prev.filter((c) => c.id !== chatToDelete.id)
                  );
                  setChatToDelete(null);
                }}
              >
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setChatToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
