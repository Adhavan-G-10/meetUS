import React from 'react';
import { useSocket } from '../hooks/useChat';

export const HomePage = ({ onStartChat }) => {
  const { isConnected, onlineUsers } = useSocket();

  return (
    <div className="h-screen w-full bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-8 max-w-md w-full">
        {/* Logo / Title */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2 animate-fade-in">
            MeetUS
          </h1>
          <p className="text-gray-400 text-lg">Anonymous Chat with Strangers</p>
        </div>

        {/* Info Cards */}
        <div className="w-full space-y-3 animate-slide-up">
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-gray-300 font-semibold">👥 {onlineUsers} People Online</p>
          </div>

          <div className="glass p-4 rounded-xl text-center">
            <p className="text-gray-400 text-sm">🔒 Completely Anonymous</p>
            <p className="text-gray-500 text-xs mt-1">No registration needed</p>
          </div>

          <div className="glass p-4 rounded-xl text-center">
            <p className="text-gray-400 text-sm">⚡ Instant Connections</p>
            <p className="text-gray-500 text-xs mt-1">Random 1-to-1 matching</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStartChat}
          disabled={!isConnected}
          className={`w-full glass px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            isConnected
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border border-blue-400/30'
              : 'border border-gray-500/30'
          }`}
        >
          {isConnected ? 'Start Chat' : 'Connecting...'}
        </button>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>💬 Be respectful and follow chat guidelines</p>
          <p>❌ Inappropriate content will result in disconnection</p>
        </div>
      </div>
    </div>
  );
};
