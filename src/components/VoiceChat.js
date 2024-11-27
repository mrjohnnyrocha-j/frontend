import React, { useState, useRef, useEffect } from 'react';

const VoiceChat = () => {
  const [isMuted, setIsMuted] = useState(true);
  const localStream = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Get microphone access
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      localStream.current = stream;
      audioRef.current.srcObject = stream;
    });

    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    localStream.current.getAudioTracks()[0].enabled = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="voice-chat">
      <h2>Voice Chat</h2>
      <audio ref={audioRef} autoPlay muted={isMuted}></audio>
      <button onClick={toggleMute}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
};

export default VoiceChat;
