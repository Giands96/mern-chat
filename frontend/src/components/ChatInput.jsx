// Componente de entrada de mensaje optimizado
import React, { memo } from 'react';
import { Send } from 'lucide-react'; // Suponiendo que estás usando lucide-react

// Usa memo para evitar re-renders innecesarios
const ChatInput = memo(({ newMessage, setNewMessage, sendMessage }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  return (
    <form className="flex items-center gap-2 mt-2">
      <input
        type="text"
        className="bg-white w-full p-2 rounded-l border border-gray-300"
        placeholder="Start with a message"
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        value={newMessage}
      />
      <button
        type="button"
        onClick={sendMessage}
        disabled={!newMessage.trim()}
        className={`p-2 rounded-r ${
          newMessage.trim() 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } transition-colors`}
      >
        <Send size={20} />
      </button>
    </form>
  );
});

export default ChatInput;