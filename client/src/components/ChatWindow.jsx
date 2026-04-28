import React, { useRef, useEffect } from 'react';

export const ChatWindow = ({ messages, peerTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, peerTyping]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 overflow-y-auto glass rounded-xl p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg font-semibold mb-2">Start a conversation</p>
              <p className="text-sm">Messages will appear here</p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex animate-slide-up ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl break-words ${
                msg.sender === 'you'
                  ? 'bg-blue-600/80 text-white rounded-br-none'
                  : 'bg-dark-700/80 text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm md:text-base">{msg.message}</p>
            </div>
          </div>
        ))}

        {peerTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 bg-dark-700/50 px-4 py-2 rounded-2xl rounded-bl-none">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
