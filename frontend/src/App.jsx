import { useState, useEffect, useRef } from "react";
import Login from "./Login";

function App() {
  /* AUTH */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  /* CHAT */
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* UI */
  const [darkMode, setDarkMode] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  /* RENAME */
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [hydrated, setHydrated] = useState(false);

  const messagesEndRef = useRef(null);
  const currentChat = chats.find((c) => c.id === currentChatId);

  /* LOAD SESSION */
  useEffect(() => {
    const savedUser = localStorage.getItem("cc-user");
    const savedTheme = localStorage.getItem("cloud-companion-theme");

    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
    }
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  /* LOAD CHATS */
  useEffect(() => {
    if (!isLoggedIn || !username) return;

    const savedChats = localStorage.getItem(
      `cloud-companion-chats-${username}`
    );

    setChats(savedChats ? JSON.parse(savedChats) : []);
    setCurrentChatId(null);
    setHydrated(true);
  }, [isLoggedIn, username]);

  /* SAVE CHATS */
  useEffect(() => {
    if (!hydrated || !username) return;
    localStorage.setItem(
      `cloud-companion-chats-${username}`,
      JSON.stringify(chats)
    );
  }, [chats, hydrated, username]);

  /* SAVE THEME */
  useEffect(() => {
    localStorage.setItem("cloud-companion-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* AUTOSCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, loading]);

  /* AUTH */
  function handleLogin(user) {
    setUsername(user);
    setIsLoggedIn(true);
  }

  function handleLogoutConfirmed() {
    localStorage.removeItem("cc-user");
    setIsLoggedIn(false);
    setUsername("");
    setChats([]);
    setCurrentChatId(null);
    setConfirmLogout(false);
  }

  /* CHAT */
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

  /* =========================
     FRONTEND-ONLY BOT LOGIC
     ========================= */
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
        text: "🤖 This is a frontend demo reply.",
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

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`layout ${darkMode ? "dark" : ""}`}>
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
              data-tooltip="Rename"
              onClick={(e) => {
                e.stopPropagation();
                startRename(chat);
              }}
            >
              ✏️
            </button>

            <button
              className="delete-btn"
              data-tooltip="Delete"
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

      {/* CHAT */}
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
