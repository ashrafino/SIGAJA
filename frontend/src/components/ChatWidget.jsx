import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageSquare, X, Send } from "lucide-react";
import "./ChatWidget.css";

const SUGGESTIONS = [
  "Combien de dossiers en cours ?",
  "Quels contrats expirent bientôt ?",
  "Résumé des assurances",
  "Actions urgentes ?",
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("sigaja_chat_history");
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text: "Bonjour ! Je suis l'assistant **SIGAJA (SRM-LS)** 🤖. Je peux vous aider à consulter l'état des dossiers, contrats et assurances. Posez-moi une question !",
          },
        ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    localStorage.setItem(
      "sigaja_chat_history",
      JSON.stringify(messages.slice(-50)),
    );
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = text.trim();
    const newMessages = [...messages, { sender: "user", text: userMsg }];
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}api/chat`,
        {
          message: userMsg,
          history: newMessages.slice(-10),
        },
        config,
      );

      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Erreur de connexion au serveur IA. Vérifiez votre connexion.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
  };

  // Simple markdown-like rendering
  const renderText = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, "• $1")
      .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="chat-widget-container">
      {isOpen ? (
        <div className="chat-window shadow-xl">
          <div className="chat-header">
            <div className="chat-title">
              <MessageSquare size={18} />
              <span>Assistant SIGAJA (SRM-LS)</span>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <div
                  className="message-bubble"
                  dangerouslySetInnerHTML={{
                    __html:
                      msg.sender === "bot" ? renderText(msg.text) : msg.text,
                  }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length <= 2 && !isLoading && (
            <div className="suggestion-chips">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form className="chat-footer" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Posez votre question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="send-btn"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button className="chat-fab shadow-xl" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} color="white" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
