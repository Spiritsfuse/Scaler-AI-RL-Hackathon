import React, { useState, useEffect, useRef } from 'react';
import '../styles/AudioRecorder.css'; // Add path to your CSS

const AudioRecorder = ({ isOpen, onClose }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveformHeights, setWaveformHeights] = useState([]);
  const timerRef = useRef(null);

  // Generate random waveform heights
  useEffect(() => {
    if (isOpen) {
      const heights = Array.from({ length: 24 }, () =>
        Math.floor(Math.random() * 15) + 10
      );
      setWaveformHeights(heights);
      setRecordingTime(0);
    }
  }, [isOpen]);

  // Recording timer
  useEffect(() => {
    if (isOpen) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    console.log('Audio sent!');
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="audio-recorder-overlay">
      <div className="audio-recorder-popup">
        {/* Cancel Button - Top Right */}
        <button className="audio-cancel-button" onClick={handleCancel} title="Cancel">
          <svg viewBox="0 0 20 20" className="icon">
            <path fill="currentColor" fillRule="evenodd"
              d="M16.53 3.47a.75.75 0 0 1 0 1.06L11.06 10l5.47 5.47a.75.75 0 0 1-1.06 1.06L10 11.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L8.94 10 3.47 4.53a.75.75 0 0 1 1.06-1.06L10 8.94l5.47-5.47a.75.75 0 0 1 1.06 0"
              clipRule="evenodd"></path>
          </svg>
        </button>

        {/* Audio Preview Box */}
        <div className="audio-preview-box">
          <div className="audio-waveform">
            {waveformHeights.map((height, index) => (
              <div
                key={index}
                className="audio-waveform-bar"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
          <div className="audio-timer">{formatTime(recordingTime)}</div>
        </div>

        {/* Control Bar */}
        <div className="audio-control-bar">
          <button className="audio-send-button" onClick={handleSend} title="Send audio">
            <svg viewBox="0 0 20 20" className="icon">
              <path fill="currentColor" fillRule="evenodd"
                d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0"
                clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
