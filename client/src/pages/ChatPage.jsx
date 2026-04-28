import React from 'react';
import { ChatWindow } from '../components/ChatWindow';
import { MessageInput } from '../components/MessageInput';
import { StatusIndicator } from '../components/StatusIndicator';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { VideoWindow } from '../components/VideoWindow';
import { useChat, useSocket } from '../hooks/useChat';
import { useWebRTC } from '../hooks/useWebRTC';

export const ChatPage = ({ onBack }) => {
  const { socket, isConnected, onlineUsers } = useSocket();
  const {
    roomId,
    peerId,
    messages,
    peerTyping,
    chatStatus,
    waitingPosition,
    waitingCount,
    startChat,
    sendMessage,
    sendTyping,
    nextUser,
  } = useChat();

  // WebRTC hook for video
  const {
    localVideoRef,
    remoteVideoRef,
    videoEnabled,
    audioEnabled,
    connectionStatus,
    error: videoError,
    toggleVideo,
    toggleAudio,
    cleanup: cleanupVideo,
  } = useWebRTC(roomId && chatStatus === 'connected' ? roomId : null, peerId);

  React.useEffect(() => {
    // Auto-start chat on page load
    if (isConnected && !roomId && chatStatus === 'idle') {
      startChat();
    }
  }, [isConnected, roomId, chatStatus]);

  // Cleanup video on disconnect or next
  React.useEffect(() => {
    if (chatStatus !== 'connected') {
      cleanupVideo();
    }
  }, [chatStatus, cleanupVideo]);

  const handleNextUser = () => {
    cleanupVideo();
    if (chatStatus === 'disconnected') {
      startChat();
    } else {
      nextUser();
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex flex-col p-4 md:p-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">MeetUS</h1>
          <p className="text-xs md:text-sm text-gray-400">Anonymous Chat</p>
        </div>
        <button
          onClick={onBack}
          className="glass px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all duration-200"
        >
          ← Back
        </button>
      </div>

      {/* Status */}
      <StatusIndicator
        status={chatStatus}
        waitingPosition={waitingPosition}
        waitingCount={waitingCount}
        onlineUsers={onlineUsers}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        {chatStatus === 'waiting' || (chatStatus === 'idle' && !roomId) ? (
          <LoadingAnimation
            text={chatStatus === 'waiting' ? `Position: ${waitingPosition + 1} in queue` : 'Finding a stranger...'}
          />
        ) : chatStatus === 'disconnected' ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400 mb-2">Stranger Disconnected</p>
              <p className="text-gray-400 mb-6">They left the chat</p>
              <button
                onClick={handleNextUser}
                className="glass px-8 py-3 rounded-lg font-semibold text-white hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95 bg-green-600/30 hover:bg-green-600/50 border border-green-500/30"
              >
                Find Another Stranger
              </button>
            </div>
          </div>
        ) : chatStatus === 'connected' && roomId ? (
          <>
            {/* Video Chat Area */}
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              <VideoWindow
                localVideoRef={localVideoRef}
                remoteVideoRef={remoteVideoRef}
                videoEnabled={videoEnabled}
                audioEnabled={audioEnabled}
                connectionStatus={connectionStatus}
                error={videoError}
                onToggleVideo={toggleVideo}
                onToggleAudio={toggleAudio}
              />

              {/* Chat Window Below Video (optional - for text messages) */}
              <div className="hidden md:flex md:h-32 rounded-lg overflow-hidden border border-white/10">
                <ChatWindow messages={messages} peerTyping={peerTyping} />
              </div>
            </div>

            {/* Message Input and Actions */}
            <div className="flex flex-col gap-3">
              <MessageInput
                onSendMessage={sendMessage}
                onTyping={sendTyping}
                disabled={!roomId}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleNextUser}
                  className="flex-1 glass px-4 py-3 rounded-lg font-semibold text-white hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95 bg-red-600/30 hover:bg-red-600/50 border border-red-500/30"
                >
                  Next Stranger
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
