import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket, SOCKET_EVENTS } from '../utils/socket';

const STUN_SERVERS = [
  'stun:stun.l.google.com:19302',
  'stun:stun1.l.google.com:19302',
  'stun:stun2.l.google.com:19302',
];

export const useWebRTC = (roomId, peerId) => {
  const socket = getSocket();

  // Refs for WebRTC
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(new MediaStream());

  // Video elements refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // State
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, failed
  const [error, setError] = useState(null);

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: STUN_SERVERS.map((url) => ({ urls: url })),
      });

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          setConnectionStatus('connected');
        } else if (peerConnection.connectionState === 'failed' || peerConnection.connectionState === 'disconnected') {
          setConnectionStatus('failed');
        }
      };

      // Handle ICE connection state changes
      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
      };

      // Handle remote stream tracks
      peerConnection.ontrack = (event) => {
        console.log('Remote track received:', event.track.kind);
        remoteStreamRef.current.addTrack(event.track);
        setRemoteStream(remoteStreamRef.current);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }
      };

      peerConnectionRef.current = peerConnection;
      return peerConnection;
    } catch (err) {
      console.error('Error initializing peer connection:', err);
      setError('Failed to initialize video connection');
      return null;
    }
  }, [roomId, socket]);

  // Get local media stream
  const getLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Camera/microphone access denied. Video chat unavailable.');
      return null;
    }
  }, []);

  // Add local tracks to peer connection
  const addLocalTracksToPC = useCallback((peerConnection, stream) => {
    try {
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
      console.log('Local tracks added to peer connection');
    } catch (err) {
      console.error('Error adding local tracks:', err);
      setError('Failed to add local tracks');
    }
  }, []);

  // Create offer
  const createAndSendOffer = useCallback(
    async (peerConnection) => {
      try {
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        await peerConnection.setLocalDescription(offer);

        socket.emit(SOCKET_EVENTS.WEBRTC_OFFER, {
          roomId,
          offer,
        });

        console.log('Offer sent');
      } catch (err) {
        console.error('Error creating offer:', err);
        setError('Failed to create video offer');
      }
    },
    [roomId, socket]
  );

  // Handle remote offer
  const handleRemoteOffer = useCallback(
    async (offer) => {
      try {
        const peerConnection = peerConnectionRef.current;
        if (!peerConnection) return;

        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit(SOCKET_EVENTS.WEBRTC_ANSWER, {
          roomId,
          answer,
        });

        console.log('Answer sent');
      } catch (err) {
        console.error('Error handling remote offer:', err);
        setError('Failed to handle video offer');
      }
    },
    [roomId, socket]
  );

  // Handle remote answer
  const handleRemoteAnswer = useCallback(async (answer) => {
    try {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('Remote answer set');
    } catch (err) {
      console.error('Error handling remote answer:', err);
      setError('Failed to handle video answer');
    }
  }, []);

  // Handle ICE candidate
  const handleRemoteICECandidate = useCallback(async (candidate) => {
    try {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection || !candidate) return;

      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('ICE candidate added');
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  }, [videoEnabled]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  }, [audioEnabled]);

  // Cleanup resources
  const cleanup = useCallback(() => {
    console.log('Cleaning up WebRTC resources');

    // Stop local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setLocalStream(null);
    setRemoteStream(null);
    setConnectionStatus('connecting');
  }, []);

  // Initialize video on mount/when roomId changes
  useEffect(() => {
    if (!roomId || !peerId) return;

    const initializeVideo = async () => {
      try {
        setConnectionStatus('connecting');
        setError(null);

        // Get local stream
        const stream = await getLocalStream();
        if (!stream) {
          setError('Failed to access camera/microphone');
          return;
        }

        // Initialize peer connection
        const peerConnection = initializePeerConnection();
        if (!peerConnection) {
          stream.getTracks().forEach((track) => track.stop());
          setError('Failed to initialize video connection');
          return;
        }

        // Add local tracks
        addLocalTracksToPC(peerConnection, stream);

        // Create and send offer (first user to initiate)
        await createAndSendOffer(peerConnection);
      } catch (err) {
        console.error('Error initializing video:', err);
        setError('Failed to initialize video chat');
      }
    };

    initializeVideo();
  }, [roomId, peerId, getLocalStream, initializePeerConnection, addLocalTracksToPC, createAndSendOffer]);

  // Listen for remote offer
  useEffect(() => {
    socket.on(SOCKET_EVENTS.WEBRTC_OFFER, (data) => {
      console.log('Remote offer received');
      handleRemoteOffer(data.offer);
    });

    return () => socket.off(SOCKET_EVENTS.WEBRTC_OFFER);
  }, [socket, handleRemoteOffer]);

  // Listen for remote answer
  useEffect(() => {
    socket.on(SOCKET_EVENTS.WEBRTC_ANSWER, (data) => {
      console.log('Remote answer received');
      handleRemoteAnswer(data.answer);
    });

    return () => socket.off(SOCKET_EVENTS.WEBRTC_ANSWER);
  }, [socket, handleRemoteAnswer]);

  // Listen for ICE candidates
  useEffect(() => {
    socket.on(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, (data) => {
      handleRemoteICECandidate(data.candidate);
    });

    return () => socket.off(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE);
  }, [socket, handleRemoteICECandidate]);

  return {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    videoEnabled,
    audioEnabled,
    connectionStatus,
    error,
    toggleVideo,
    toggleAudio,
    cleanup,
  };
};
