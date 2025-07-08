import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Message = {
  sender: "user" | "bot";
  text: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem("chat_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    sessionStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:3000/mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "550e8400-e29b-41d4-a716-446655440001",
          message: input,
        }),
      });

      if (response.ok) {
        const botReply = await response.text();
        setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
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

    setInput("");
  };

  const userAvatar =
    "https://i.ibb.co/MZj7tCn/user-avatar.png"; // o usa uno propio
  const botAvatar =
    "https://i.ibb.co/zf7vnL6/robot-avatar.png"; // o usa uno propio

  return (
    <div className="flex flex-col h-full bg-white text-sm">
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
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
              className={`p-3 rounded-2xl max-w-[80%] leading-snug shadow-md ${
                msg.sender === "user"
                  ? "bg-[#28465A] text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
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
      </div>

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
    </div>
  );
};

export default ChatBot;
