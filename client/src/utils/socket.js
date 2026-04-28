import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      transports: ['websocket', 'polling'],
    });
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// Socket event constants
export const SOCKET_EVENTS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnect',
  START_CHAT: 'startChat',
  MATCHED: 'matched',
  WAITING_IN_QUEUE: 'waitingInQueue',
  SEND_MESSAGE: 'sendMessage',
  MESSAGE_SENT: 'messageSent',
  RECEIVE_MESSAGE: 'receiveMessage',
  TYPING: 'typing',
  PEER_TYPING: 'peerTyping',
  NEXT_USER: 'nextUser',
  PEER_DISCONNECTED: 'peerDisconnected',
  READY_FOR_NEXT_CHAT: 'readyForNextChat',
  GET_STATS: 'getStats',
  STATS: 'stats',
  ONLINE_USERS: 'onlineUsers',
  ERROR: 'error',
  // WebRTC events
  WEBRTC_OFFER: 'webrtc-offer',
  WEBRTC_ANSWER: 'webrtc-answer',
  WEBRTC_ICE_CANDIDATE: 'webrtc-ice-candidate',
};
