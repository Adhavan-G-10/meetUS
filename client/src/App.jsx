import React, { useState } from 'react';
import { ChatPage } from './pages/ChatPage';
import { HomePage } from './pages/HomePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleStartChat = () => {
    setCurrentPage('chat');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' ? (
        <HomePage onStartChat={handleStartChat} />
      ) : (
        <ChatPage onBack={handleBackToHome} />
      )}
    </>
  );
}

export default App;
