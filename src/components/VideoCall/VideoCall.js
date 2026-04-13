// src/components/VideoCall/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import './VideoCall.css';

const VideoCall = ({ doctorName, patientName, onEnd }) => {
  const localVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    startLocalStream();
    startTimer();
    
    return () => {
      stopTracks();
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsConnecting(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsConnecting(false);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  };

  const stopTracks = () => {
    if (localVideoRef.current?.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-call-container">
      <div className="video-call-header">
        <div className="call-info">
          <i className="fas fa-video"></i>
          <span>Video Consultation with {doctorName || 'Doctor'}</span>
          <span className="call-duration">{formatDuration(callDuration)}</span>
        </div>
        <button className="end-call-btn" onClick={onEnd}>
          <i className="fas fa-phone-slash"></i> End Call
        </button>
      </div>
      
      <div className="video-grid">
        <div className="remote-video">
          {isConnecting ? (
            <div className="connecting-screen">
              <i className="fas fa-spinner fa-pulse"></i>
              <p>Connecting to {doctorName || 'Doctor'}...</p>
            </div>
          ) : (
            <div className="waiting-screen">
              <i className="fas fa-user-circle"></i>
              <h3>{doctorName || 'Doctor'}</h3>
              <p>Waiting for doctor to join...</p>
            </div>
          )}
          <div className="remote-label">{doctorName || 'Doctor'}</div>
        </div>
        
        <div className="local-video">
          <video ref={localVideoRef} autoPlay muted playsInline className="local-video-element" />
          <div className="local-label">You</div>
          {isVideoOff && <div className="video-off-overlay">Camera Off</div>}
        </div>
      </div>
      
      <div className="call-controls">
        <button className={`control-btn ${isMuted ? 'active' : ''}`} onClick={toggleMute}>
          <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
        </button>
        <button className={`control-btn ${isVideoOff ? 'active' : ''}`} onClick={toggleVideo}>
          <i className={`fas ${isVideoOff ? 'fa-video-slash' : 'fa-video'}`}></i>
        </button>
        <button className="control-btn end-call" onClick={onEnd}>
          <i className="fas fa-phone-slash"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoCall;