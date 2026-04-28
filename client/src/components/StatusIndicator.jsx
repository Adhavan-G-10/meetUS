import React from 'react';

export const StatusIndicator = ({ status, waitingPosition, waitingCount, onlineUsers }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'waiting':
      case 'idle':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected to stranger';
      case 'waiting':
        return `Waiting... (Position: ${waitingPosition + 1} of ${waitingCount})`;
      case 'disconnected':
        return 'Stranger disconnected';
      default:
        return 'Ready to chat';
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 glass rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${status === 'waiting' ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-medium text-gray-200">{getStatusText()}</span>
      </div>
      {onlineUsers !== undefined && (
        <div className="text-xs text-gray-400">
          👥 {onlineUsers} online
        </div>
      )}
    </div>
  );
};
