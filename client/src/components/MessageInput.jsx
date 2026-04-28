import React, { useState, useEffect } from 'react';

export const MessageInput = ({ onSendMessage, onTyping, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = React.useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Send typing indicator
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setIsTyping(false);
      onTyping(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 glass px-4 py-3 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="glass px-6 py-3 rounded-full font-semibold text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Send
      </button>
    </form>
  );
};
