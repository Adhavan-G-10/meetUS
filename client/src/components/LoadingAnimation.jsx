import React from 'react';

export const LoadingAnimation = ({ text = 'Connecting...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <div className="text-center">
        <p className="text-gray-300 font-semibold">{text}</p>
        <p className="text-gray-500 text-sm mt-2">Finding someone to chat with...</p>
      </div>
    </div>
  );
};
