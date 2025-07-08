// src/components/ChatBotFloating.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBot from './ChatBot';

const ChatBotFloating = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="w-80 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#28465A]"
          >
            <div className="bg-[#28465A] text-white px-4 py-2 flex justify-between items-center">
              <h3 className="font-semibold">Asistente Virtual</h3>
              <button onClick={() => setIsOpen(false)} className="text-lg hover:text-red-300">✕</button>
            </div>
            <ChatBot />
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-[#28465A] text-white p-4 rounded-full shadow-xl hover:bg-[#1f3847]"
        >
          💬
        </motion.button>
      )}
    </div>
  );
};

export default ChatBotFloating;
