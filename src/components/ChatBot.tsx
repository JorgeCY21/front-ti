import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

type Message = {
  sender: "user" | "bot";
  text: string;
};

const ChatBot = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem("chat_messages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Limpiar historial al cerrar sesión
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem("chat_messages");
      setMessages([]);
    }
  }, [isAuthenticated]);

  // Guardar historial + scroll automático
  useEffect(() => {
    sessionStorage.setItem("chat_messages", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseBotReply = (raw: string): string => {
    try {
      const parsed = JSON.parse(raw);
      return parsed.text || raw;
    } catch {
      return raw;
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:3000/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "550e8400-e29b-41d4-a716-446655440001",
          message: trimmed,
        }),
      });

      if (response.ok) {
        const raw = await response.text();
        const parsedText = parseBotReply(raw);
        setMessages((prev) => [...prev, { sender: "bot", text: parsedText }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Hubo un error al procesar 😓" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "No se pudo conectar al servidor 🛑" },
      ]);
    }
  };

  const clearChat = () => {
    if (confirm("¿Estás seguro de que quieres borrar el historial de chat?")) {
      setMessages([]);
      sessionStorage.removeItem("chat_messages");
    }
  };

  const userAvatar = "https://i.ibb.co/MZj7tCn/user-avatar.png";
  const botAvatar = "https://i.ibb.co/zf7vnL6/robot-avatar.png";

  if (!isOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#28465A] text-white p-4 rounded-full shadow-xl z-50"
        aria-label="Abrir chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-6 right-6 w-full max-w-md h-[500px] flex flex-col bg-white rounded-lg shadow-xl overflow-hidden z-50"
    >
      {/* Encabezado */}
      <div className="bg-[#28465A] text-white px-4 py-3 flex justify-between items-center">
        <h1 className="font-semibold text-lg">Asistente Virtual</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="text-white hover:text-red-300 transition p-1"
            title="Borrar historial de chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-red-300 transition p-1"
            title="Minimizar chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Envía un mensaje para comenzar la conversación</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-end gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <img
                src={botAvatar}
                alt="Bot"
                className="w-7 h-7 rounded-full border shadow"
              />
            )}
            <div
              className={`p-3 rounded-2xl max-w-[80%] leading-snug shadow-md whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-[#28465A] text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            {msg.sender === "user" && (
              <img
                src={userAvatar}
                alt="You"
                className="w-7 h-7 rounded-full border shadow"
              />
            )}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Caja de entrada */}
      <div className="border-t px-3 py-2 flex items-center gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#28465A] transition"
        />
        <button
          onClick={sendMessage}
          className="bg-[#28465A] hover:bg-[#1f3847] text-white px-4 py-2 rounded-full transition font-semibold"
        >
          Enviar
        </button>
      </div>
    </motion.div>
  );
};

export default ChatBot;