import { useEffect, useState } from 'react';
import { getSocket, SOCKET_EVENTS } from '../utils/socket';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    // Connection event
    socketInstance.on(SOCKET_EVENTS.CONNECTED, (data) => {
      console.log('Connected:', data);
      setIsConnected(true);
      setUserId(data.userId);
      setOnlineUsers(data.onlineUsers);
    });

    // Disconnect event
    socketInstance.on(SOCKET_EVENTS.DISCONNECTED, () => {
      console.log('Disconnected');
      setIsConnected(false);
      setUserId(null);
    });

    // Online users update
    socketInstance.on(SOCKET_EVENTS.ONLINE_USERS, (data) => {
      setOnlineUsers(data.count);
    });

    // Error event
    socketInstance.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      // Don't disconnect on unmount - socket should persist
    };
  }, []);

  return {
    socket,
    isConnected,
    userId,
    onlineUsers,
  };
};

export const useChat = () => {
  const [roomId, setRoomId] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [peerTyping, setPeerTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState('idle'); // idle, waiting, connected, disconnected
  const [waitingPosition, setWaitingPosition] = useState(null);
  const [waitingCount, setWaitingCount] = useState(0);

  const socket = getSocket();

  // Handle matched event
  useEffect(() => {
    const handleMatched = (data) => {
      console.log('Matched:', data);
      setRoomId(data.roomId);
      setPeerId(data.peerId);
      setMessages([]);
      setChatStatus('connected');
      setWaitingPosition(null);
    };

    socket.on(SOCKET_EVENTS.MATCHED, handleMatched);

    return () => socket.off(SOCKET_EVENTS.MATCHED, handleMatched);
  }, [socket]);

  // Handle waiting in queue
  useEffect(() => {
    const handleWaitingInQueue = (data) => {
      console.log('Waiting in queue:', data);
      setChatStatus('waiting');
      setWaitingPosition(data.position);
      setWaitingCount(data.waitingUsers);
    };

    socket.on(SOCKET_EVENTS.WAITING_IN_QUEUE, handleWaitingInQueue);

    return () => socket.off(SOCKET_EVENTS.WAITING_IN_QUEUE, handleWaitingInQueue);
  }, [socket]);

  // Handle receive message
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, { message: data.message, sender: 'stranger', timestamp: data.timestamp }]);
      playSound();
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);

    return () => socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
  }, [socket]);

  // Handle message sent
  useEffect(() => {
    const handleMessageSent = (data) => {
      setMessages((prev) => [...prev, { message: data.message, sender: 'you', timestamp: data.timestamp }]);
    };

    socket.on(SOCKET_EVENTS.MESSAGE_SENT, handleMessageSent);

    return () => socket.off(SOCKET_EVENTS.MESSAGE_SENT, handleMessageSent);
  }, [socket]);

  // Handle peer typing
  useEffect(() => {
    const handlePeerTyping = (data) => {
      setPeerTyping(data.isTyping);
    };

    socket.on(SOCKET_EVENTS.PEER_TYPING, handlePeerTyping);

    return () => socket.off(SOCKET_EVENTS.PEER_TYPING, handlePeerTyping);
  }, [socket]);

  // Handle peer disconnected
  useEffect(() => {
    const handlePeerDisconnected = (data) => {
      console.log('Peer disconnected:', data);
      setChatStatus('disconnected');
      setRoomId(null);
      setPeerId(null);
    };

    socket.on(SOCKET_EVENTS.PEER_DISCONNECTED, handlePeerDisconnected);

    return () => socket.off(SOCKET_EVENTS.PEER_DISCONNECTED, handlePeerDisconnected);
  }, [socket]);

  // Handle ready for next chat
  useEffect(() => {
    const handleReadyForNextChat = () => {
      console.log('Ready for next chat');
      setRoomId(null);
      setPeerId(null);
      setMessages([]);
      setChatStatus('idle');
      setWaitingPosition(null);
    };

    socket.on(SOCKET_EVENTS.READY_FOR_NEXT_CHAT, handleReadyForNextChat);

    return () => socket.off(SOCKET_EVENTS.READY_FOR_NEXT_CHAT, handleReadyForNextChat);
  }, [socket]);

  const startChat = () => {
    socket.emit(SOCKET_EVENTS.START_CHAT);
  };

  const sendMessage = (message) => {
    if (!roomId || !message.trim()) return;
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { message: message.trim(), roomId });
  };

  const sendTyping = (isTyping) => {
    if (!roomId) return;
    socket.emit(SOCKET_EVENTS.TYPING, { roomId, isTyping });
  };

  const nextUser = () => {
    if (!roomId) return;
    socket.emit(SOCKET_EVENTS.NEXT_USER, { roomId });
  };

  const playSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Audio context not available');
    }
  };

  return {
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
  };
};
