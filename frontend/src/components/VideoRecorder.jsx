import React, { useState, useRef, useEffect } from 'react';
import '../styles/VideoRecorder.css'; // Add path to your CSS


const VideoRecorder = ({ isOpen, onClose }) => {
  const [showEffectsMenu, setShowEffectsMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showCameraSubmenu, setShowCameraSubmenu] = useState(false);
  const [showMicrophoneSubmenu, setShowMicrophoneSubmenu] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(false);
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, paused
  const [recordingTime, setRecordingTime] = useState(0);

  const imageUploadRef = useRef(null);
  const videoUploadRef = useRef(null);
  const effectsMenuRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const cameraMenuItemRef = useRef(null);
  const microphoneMenuItemRef = useRef(null);
  const timerRef = useRef(null);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });

  // Recording timer
  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 300) { // 5 minutes max
            setRecordingState('paused');
            return 300;
          }
          return prev + 1;
        });
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
  }, [recordingState]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (effectsMenuRef.current && !effectsMenuRef.current.contains(event.target)) {
        setShowEffectsMenu(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
        setShowCameraSubmenu(false);
        setShowMicrophoneSubmenu(false);
      }
    };

    if (showEffectsMenu || showSettingsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEffectsMenu, showSettingsMenu]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRecordingState('idle');
      setRecordingTime(0);
      setCameraOn(false);
      setMicrophoneOn(false);
      setShowEffectsMenu(false);
      setShowSettingsMenu(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = () => {
    imageUploadRef.current?.click();
  };

  const handleVideoUpload = () => {
    videoUploadRef.current?.click();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecord = () => {
    setRecordingState('recording');
    setRecordingTime(0);
  };

  const handlePause = () => {
    setRecordingState('paused');
  };

  const handleResume = () => {
    setRecordingState('recording');
  };

  const handleStop = () => {
    setRecordingState('idle');
    setRecordingTime(0);
  };

  const handleCancel = () => {
    setRecordingState('idle');
    setRecordingTime(0);
  };

  const handleDone = () => {
    // Simulate saving
    console.log('Video saved!');
    onClose();
  };

  const calculateSubmenuPosition = (element) => {
    if (!element) return { top: 0, left: 0 };
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.right + 4
    };
  };

  const handleCameraMouseEnter = () => {
    setShowCameraSubmenu(true);
    if (cameraMenuItemRef.current) {
      const position = calculateSubmenuPosition(cameraMenuItemRef.current);
      setSubmenuPosition(position);
    }
  };

  const handleMicrophoneMouseEnter = () => {
    setShowMicrophoneSubmenu(true);
    if (microphoneMenuItemRef.current) {
      const position = calculateSubmenuPosition(microphoneMenuItemRef.current);
      setSubmenuPosition(position);
    }
  };

  return (
    <div className="video-recorder-backdrop" onClick={handleBackdropClick}>
      <div className="video-recorder-modal">
        {/* Header */}
        <div className="video-recorder-header">
          <div className="video-recorder-title">
            <h1>Record video clip</h1>
          </div>
          <div className="video-recorder-header-icons">
            <button className="icon-button" aria-label="See how they work" title="See how they work">
              <svg viewBox="0 0 20 20" className="icon">
                <path fill="currentColor" fillRule="evenodd"
                  d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15M1 10a9 9 0 1 1 18 0 9 9 0 0 1-18 0m7.883-2.648c-.23.195-.383.484-.383.898a.75.75 0 0 1-1.5 0c0-.836.333-1.547.91-2.04.563-.48 1.31-.71 2.09-.71.776 0 1.577.227 2.2.729.642.517 1.05 1.294 1.05 2.271 0 .827-.264 1.515-.807 2.001-.473.423-1.08.623-1.693.703V12h-1.5v-1c0-.709.566-1.211 1.18-1.269.507-.048.827-.18 1.013-.347.162-.145.307-.39.307-.884 0-.523-.203-.87-.492-1.104C10.951 7.148 10.502 7 10 7c-.497 0-.876.146-1.117.352M10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
                  clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Video Preview Area */}
        <div className="video-recorder-content">
          <div className="video-recorder-canvas-container">
            {/* User Avatar Placeholder */}
            <div className="video-recorder-avatar">
              <svg viewBox="0 0 20 20" className="avatar-icon">
                <path fill="currentColor" fillRule="evenodd"
                  d="M10 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6M5.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0M3.751 13.344A2.25 2.25 0 0 1 5.5 12.5h9a2.25 2.25 0 0 1 1.749.844c.44.537.751 1.185.751 1.906V16a.75.75 0 0 1-1.5 0v-.75c0-.44-.19-.87-.499-1.219A.75.75 0 0 1 14.5 14h-9a.75.75 0 0 1-.501.031c-.309.35-.499.78-.499 1.219V16a.75.75 0 0 1-1.5 0v-.75c0-.721.311-1.369.751-1.906"
                  clipRule="evenodd"></path>
              </svg>
            </div>

            {/* Canvas for video feed */}
            <canvas className="video-recorder-canvas" width="1280" height="720"></canvas>

            {/* Video Controls */}
            <div className="video-controls">
              <button
                className={`control-button ${cameraOn ? 'active' : ''}`}
                aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
                title={cameraOn ? "Turn camera off" : "Turn camera on"}
                onClick={() => setCameraOn(!cameraOn)}
              >
                {cameraOn ? (
                  <svg viewBox="0 0 20 20" className="icon">
                    <path fill="currentColor" fillRule="evenodd"
                      d="M2 5.25A2.25 2.25 0 0 1 4.25 3h7.5A2.25 2.25 0 0 1 14 5.25v.5l2.126-1.063a1.5 1.5 0 0 1 2.165 1.341v8.944a1.5 1.5 0 0 1-2.165 1.341L14 15.25v.5A2.25 2.25 0 0 1 11.75 18h-7.5A2.25 2.25 0 0 1 2 15.75zm2.25-.75a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75V5.25a.75.75 0 0 0-.75-.75zm9.5 1.5v8l3.709 1.855a.5.5 0 0 0 .541-.447V6.592a.5.5 0 0 0-.541-.447z"
                      clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" className="icon">
                    <path fill="currentColor" fillRule="evenodd"
                      d="M16.058 2.752a.75.75 0 1 0-1.115-1.004l-13.5 15a.75.75 0 1 0 1.114 1.004zm-2.96 5.461 1.571-1.767 2.457-1.414A1.25 1.25 0 0 1 19 6.115v7.77a1.25 1.25 0 0 1-1.874 1.084L14.5 13.456v1.294A2.25 2.25 0 0 1 12.25 17H5.288l1.334-1.5h5.628a.75.75 0 0 0 .75-.75v-2.59a.75.75 0 0 1 1.124-.65l3.376 1.943V6.547l-3.376 1.944a.75.75 0 0 1-1.025-.278M1.5 5.25v9.238L3 12.801V5.25a.75.75 0 0 1 .75-.75h6.629L11.712 3H3.75A2.25 2.25 0 0 0 1.5 5.25"
                      clipRule="evenodd"></path>
                  </svg>
                )}
              </button>

              <button
                className={`control-button ${microphoneOn ? 'active' : ''}`}
                aria-label={microphoneOn ? "Mute" : "Unmute"}
                title={microphoneOn ? "Mute" : "Unmute"}
                onClick={() => setMicrophoneOn(!microphoneOn)}
              >
                {microphoneOn ? (
                  <svg viewBox="0 0 20 20" className="icon">
                    <path fill="currentColor" fillRule="evenodd"
                      d="M10 1.5a3.5 3.5 0 0 0-3.5 3.5v3.5a3.5 3.5 0 1 0 7 0V5A3.5 3.5 0 0 0 10 1.5M8 5a2 2 0 1 1 4 0v3.5a2 2 0 1 1-4 0zm-3 3.5v.25a.75.75 0 0 1-1.5 0V8.5a5 5 0 0 0 10 0v-.25a.75.75 0 0 1 1.5 0v.25a6.5 6.5 0 0 1-5.75 6.457V16.5h1.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5h1.5v-1.543A6.5 6.5 0 0 1 3.5 8.5"
                      clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" className="icon">
                    <path fill="currentColor" fillRule="evenodd"
                      d="M16.062 2.747a.75.75 0 0 0-1.124-.994l-11.5 13a.75.75 0 1 0 1.124.994zm-3.935-.027A3.5 3.5 0 0 0 6.5 5.5v3q0 .26.037.51L8 7.362V5.5a2 2 0 0 1 3.126-1.653zM9.901 12H10a3.5 3.5 0 0 0 3.5-3.5v-.55zM5 8.5a5 5 0 0 0 .35 1.844l-1.084 1.22A6.5 6.5 0 0 1 3.5 8.5v-.25a.75.75 0 1 1 1.5 0zm4.25 6.457a6.5 6.5 0 0 1-1.62-.403l1.084-1.22A5.005 5.005 0 0 0 15 8.5v-.25a.75.75 0 0 1 1.5 0v.25a6.5 6.5 0 0 1-5.75 6.457V16.5h1.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5h1.5z"
                      clipRule="evenodd"></path>
                  </svg>
                )}
              </button>

              <div className="control-button-wrapper" ref={effectsMenuRef}>
                <button
                  className="control-button"
                  aria-label="Effects"
                  title="Effects"
                  onClick={() => {
                    setShowEffectsMenu(!showEffectsMenu);
                    setShowSettingsMenu(false);
                  }}
                >
                  <svg viewBox="0 0 20 20" className="icon">
                    <path fill="currentColor" fillRule="evenodd"
                      d="M13 1.5a.75.75 0 0 1 .736.603l.592 2.97.003.018c.343 1.972 2.045 3.633 4.07 4.173l-.174.651.174-.65.042.01a.75.75 0 0 1 0 1.45l-.042.01c-2.025.54-3.727 2.202-4.07 4.174l-.003.018-.592 2.97a.75.75 0 0 1-1.472 0l-.592-2.97-.003-.018c-.343-1.972-2.045-3.633-4.07-4.173l-.042-.011a.75.75 0 0 1 0-1.45l.042-.01c2.025-.54 3.727-2.202 4.07-4.174l.003-.018.592-2.97A.75.75 0 0 1 13 1.5m3.28 8.5c-1.539-.875-2.783-2.3-3.28-4.018C12.503 7.7 11.258 9.125 9.72 10c1.538.875 2.783 2.3 3.28 4.018.497-1.719 1.742-3.143 3.28-4.018M4.474 3.342a.5.5 0 0 0-.948 0l-.263.788a1 1 0 0 1-.633.633l-.788.263a.5.5 0 0 0 0 .948l.788.263a1 1 0 0 1 .633.633l.263.788a.5.5 0 0 0 .948 0l.263-.788a1 1 0 0 1 .633-.633l.788-.263a.5.5 0 0 0 0-.948l-.788-.263a1 1 0 0 1-.633-.633zm2.5 10a.5.5 0 0 0-.948 0l-.263.788a1 1 0 0 1-.633.633l-.788.263a.5.5 0 0 0 0 .948l.788.263a1 1 0 0 1 .633.633l.263.788a.5.5 0 0 0 .948 0l.263-.788a1 1 0 0 1 .633-.633l.788-.263a.5.5 0 0 0 0-.948l-.788-.263a1 1 0 0 1-.633-.633z"
                      clipRule="evenodd"></path>
                  </svg>
                </button>

                {/* Effects Menu */}
                {showEffectsMenu && (
                  <div className="dropdown-menu effects-menu">
                    <div className="menu-item selected">
                      <svg viewBox="0 0 20 20" className="check-icon">
                        <path fill="currentColor" fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0"
                          clipRule="evenodd"></path>
                      </svg>
                      <span>Blur background</span>
                    </div>
                    <div className="menu-divider"></div>
                    <div className="menu-item" onClick={handleImageUpload}>
                      <span>Upload background image</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="control-button-wrapper" ref={settingsMenuRef}>
                <button
                  className="control-button"
                  aria-label="Settings"
                  title="Settings"
                  onClick={() => {
                    setShowSettingsMenu(!showSettingsMenu);
                    setShowEffectsMenu(false);
                  }}
                >
                  <svg viewBox="0 0 20 20" className="icon">
                    <path fill="currentColor" fillRule="evenodd"
                      d="m9.151 3.676.271-1.108a2.5 2.5 0 0 1 1.156 0l.271 1.108a2 2 0 0 0 3.022 1.252l.976-.592a2.5 2.5 0 0 1 .817.817l-.592.975a2 2 0 0 0 1.252 3.023l1.108.27c.09.38.09.777 0 1.157l-1.108.27a2 2 0 0 0-1.252 3.023l.592.975a2.5 2.5 0 0 1-.817.818l-.976-.592a2 2 0 0 0-3.022 1.251l-.271 1.109a2.5 2.5 0 0 1-1.156 0l-.27-1.108a2 2 0 0 0-3.023-1.252l-.975.592a2.5 2.5 0 0 1-.818-.818l.592-.975a2 2 0 0 0-1.252-3.022l-1.108-.271a2.5 2.5 0 0 1 0-1.156l1.108-.271a2 2 0 0 0 1.252-3.023l-.592-.975a2.5 2.5 0 0 1 .818-.817l.975.592A2 2 0 0 0 9.15 3.676m2.335-2.39a4 4 0 0 0-2.972 0 .75.75 0 0 0-.45.518l-.372 1.523-.004.018a.5.5 0 0 1-.758.314l-.016-.01-1.34-.813a.75.75 0 0 0-.685-.048 4 4 0 0 0-2.1 2.1.75.75 0 0 0 .047.685l.814 1.34.01.016a.5.5 0 0 1-.314.759l-.018.004-1.523.372a.75.75 0 0 0-.519.45 4 4 0 0 0 0 2.971.75.75 0 0 0 .519.45l1.523.373.018.004a.5.5 0 0 1 .314.758l-.01.016-.814 1.34a.75.75 0 0 0-.048.685 4 4 0 0 0 2.101 2.1.75.75 0 0 0 .685-.048l1.34-.813.016-.01a.5.5 0 0 1 .758.314l.004.018.372 1.523a.75.75 0 0 0 .45.518 4 4 0 0 0 2.972 0 .75.75 0 0 0 .45-.518l.372-1.523.004-.018a.5.5 0 0 1 .758-.314l.016.01 1.34.813a.75.75 0 0 0 .685.049 4 4 0 0 0 2.101-2.101.75.75 0 0 0-.048-.685l-.814-1.34-.01-.016a.5.5 0 0 1 .314-.758l.018-.004 1.523-.373a.75.75 0 0 0 .519-.45 4 4 0 0 0 0-2.97.75.75 0 0 0-.519-.45l-1.523-.373-.018-.004a.5.5 0 0 1-.314-.759l.01-.015.814-1.34a.75.75 0 0 0 .048-.685 4 4 0 0 0-2.101-2.101.75.75 0 0 0-.685.048l-1.34.814-.016.01a.5.5 0 0 1-.758-.315l-.004-.017-.372-1.524a.75.75 0 0 0-.45-.518M8 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0m2-3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7"
                      clipRule="evenodd"></path>
                  </svg>
                </button>

                {/* Settings Menu */}
                {showSettingsMenu && (
                  <div className="dropdown-menu settings-menu">
                    <div
                      ref={cameraMenuItemRef}
                      className="menu-item with-submenu"
                      onMouseEnter={handleCameraMouseEnter}
                      onMouseLeave={() => setShowCameraSubmenu(false)}
                    >
                      <span>Camera</span>
                      <svg viewBox="0 0 20 20" className="chevron-icon">
                        <path fill="currentColor" fillRule="evenodd"
                          d="M7.293 4.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L11.586 10 7.293 5.707a1 1 0 0 1 0-1.414"
                          clipRule="evenodd"></path>
                      </svg>
                    </div>

                    <div
                      ref={microphoneMenuItemRef}
                      className="menu-item with-submenu"
                      onMouseEnter={handleMicrophoneMouseEnter}
                      onMouseLeave={() => setShowMicrophoneSubmenu(false)}
                    >
                      <span>Microphone</span>
                      <svg viewBox="0 0 20 20" className="chevron-icon">
                        <path fill="currentColor" fillRule="evenodd"
                          d="M7.293 4.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L11.586 10 7.293 5.707a1 1 0 0 1 0-1.414"
                          clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Camera Submenu - Rendered separately with fixed positioning */}
                {showCameraSubmenu && (
                  <div
                    className="submenu"
                    style={{ top: `${submenuPosition.top}px`, left: `${submenuPosition.left}px` }}
                    onMouseEnter={() => setShowCameraSubmenu(true)}
                    onMouseLeave={() => setShowCameraSubmenu(false)}
                  >
                    <div className="menu-item selected">
                      <svg viewBox="0 0 20 20" className="check-icon">
                        <path fill="currentColor" fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0"
                          clipRule="evenodd"></path>
                      </svg>
                      <span>HP TrueVision HD Camera</span>
                    </div>
                    <div className="menu-item">
                      <span>Integrated Webcam</span>
                    </div>
                  </div>
                )}

                {/* Microphone Submenu - Rendered separately with fixed positioning */}
                {showMicrophoneSubmenu && (
                  <div
                    className="submenu"
                    style={{ top: `${submenuPosition.top}px`, left: `${submenuPosition.left}px` }}
                    onMouseEnter={() => setShowMicrophoneSubmenu(true)}
                    onMouseLeave={() => setShowMicrophoneSubmenu(false)}
                  >
                    <div className="menu-item selected">
                      <svg viewBox="0 0 20 20" className="check-icon">
                        <path fill="currentColor" fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0"
                          clipRule="evenodd"></path>
                      </svg>
                      <span>System default (Microphone Array (R...</span>
                    </div>
                    <div className="menu-item">
                      <span>Headset (soundcore Q20i) (Bluetooth)</span>
                    </div>
                    <div className="menu-item">
                      <span>Microphone Array (Realtek(R) Audio)</span>
                    </div>
                    <div className="menu-item">
                      <span>Stereo Mix (Realtek(R) Audio)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Idle State */}
        {recordingState === 'idle' && (
          <div className="video-recorder-footer">
            <button className="footer-button outline-button" onClick={handleVideoUpload}>
              <svg viewBox="0 0 20 20" className="icon">
                <path fill="currentColor" fillRule="evenodd"
                  d="M10 2.5a.75.75 0 0 1 .75.75v8.69l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06l2.72 2.72V3.25A.75.75 0 0 1 10 2.5M3.5 12.75a.75.75 0 0 1 .75.75v2c0 .414.336.75.75.75h10a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 15 17.75H5A2.25 2.25 0 0 1 2.75 15.5v-2a.75.75 0 0 1 .75-.75"
                  clipRule="evenodd"></path>
              </svg>
              Upload video
            </button>

            <button className="footer-button outline-button">
              <svg viewBox="0 0 20 20" className="icon">
                <path fill="currentColor" fillRule="evenodd"
                  d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v7.5A2.25 2.25 0 0 1 15.75 14h-4.836l-1.707 1.707a1 1 0 0 1-1.414 0L6.086 14H4.25A2.25 2.25 0 0 1 2 11.75zm2.25-.75a.75.75 0 0 0-.75.75v7.5c0 .414.336.75.75.75h2.25a.75.75 0 0 1 .53.22L8.5 14.19l1.47-1.47a.75.75 0 0 1 .53-.22h5.25a.75.75 0 0 0 .75-.75v-7.5a.75.75 0 0 0-.75-.75z"
                  clipRule="evenodd"></path>
              </svg>
              Share screen
            </button>

            <button className="footer-button record-button-active" onClick={handleRecord}>
              Record
            </button>
          </div>
        )}

        {/* Footer - Recording State */}
        {recordingState === 'recording' && (
          <div className="video-recorder-footer recording-footer">
            <div className="progress-bar">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${(recordingTime / 300) * 100}%` }}></div>
              </div>
            </div>
            <span className="recording-time">{formatTime(recordingTime)} / 5:00</span>

            <button className="footer-button outline-button">
              <svg viewBox="0 0 20 20" className="icon">
                <path fill="currentColor" fillRule="evenodd"
                  d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v7.5A2.25 2.25 0 0 1 15.75 14h-4.836l-1.707 1.707a1 1 0 0 1-1.414 0L6.086 14H4.25A2.25 2.25 0 0 1 2 11.75zm2.25-.75a.75.75 0 0 0-.75.75v7.5c0 .414.336.75.75.75h2.25a.75.75 0 0 1 .53.22L8.5 14.19l1.47-1.47a.75.75 0 0 1 .53-.22h5.25a.75.75 0 0 0 .75-.75v-7.5a.75.75 0 0 0-.75-.75z"
                  clipRule="evenodd"></path>
              </svg>
              Share screen
            </button>

            <div className="footer-separator"></div>

            <button className="footer-button outline-button" onClick={handlePause}>
              <svg viewBox="0 0 20 20" className="icon">
                <path fill="currentColor" fillRule="evenodd"
                  d="M7 3.25A.75.75 0 0 1 7.75 2.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75zm3.75 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75z"
                  clipRule="evenodd"></path>
              </svg>
              Pause
            </button>

            <button className="footer-button stop-button" onClick={handleStop}>
              Stop
            </button>
          </div>
        )}

        {/* Footer - Paused State */}
        {recordingState === 'paused' && (
          <div className="video-recorder-footer paused-footer">
            <div className="progress-bar">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${(recordingTime / 300) * 100}%` }}></div>
              </div>
            </div>

            <div className="paused-controls">
              <button className="icon-button-control" onClick={handleResume} title="Resume">
                <svg viewBox="0 0 20 20" className="icon">
                  <path fill="currentColor" fillRule="evenodd"
                    d="M5.128 3.213A.75.75 0 0 0 4 3.861v12.277a.75.75 0 0 0 1.128.647l10.523-6.138a.75.75 0 0 0 0-1.296zM2.5 3.861c0-1.737 1.884-2.819 3.384-1.944l10.523 6.139c1.488.868 1.488 3.019 0 3.887L5.884 18.08c-1.5.875-3.384-.207-3.384-1.943z"
                    clipRule="evenodd"></path>
                </svg>
              </button>
              <span className="paused-time">{formatTime(recordingTime)} / 5:00</span>

              <div className="paused-buttons">
                <button className="footer-button outline-button">
                  <svg viewBox="0 0 20 20" className="icon">
                    <path fill="currentColor" fillRule="evenodd"
                      d="M3.5 3.25a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V4H4.25a.75.75 0 0 1-.75-.75m0 13.5a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 0 1.5H4.25a.75.75 0 0 1-.75-.75m5.293-9.457a1 1 0 0 1 1.414 0l3.5 3.5a1 1 0 0 1 0 1.414l-3.5 3.5a1 1 0 0 1-1.414-1.414L11.086 11H3.25a.75.75 0 0 1 0-1.5h7.836L8.793 7.207a1 1 0 0 1 0-1.414"
                      clipRule="evenodd"></path>
                  </svg>
                  Select thumbnail
                </button>

                <button className="footer-button outline-button">
                  <svg viewBox="0 0 20 20" className="icon">
                    <path fill="currentColor" fillRule="evenodd"
                      d="M10 2.5a.75.75 0 0 1 .75.75v8.69l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06l2.72 2.72V3.25A.75.75 0 0 1 10 2.5M3.5 12.75a.75.75 0 0 1 .75.75v2c0 .414.336.75.75.75h10a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 15 17.75H5A2.25 2.25 0 0 1 2.75 15.5v-2a.75.75 0 0 1 .75-.75"
                      clipRule="evenodd"></path>
                  </svg>
                  Download
                </button>

                <button className="footer-button done-button" onClick={handleDone}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Button (only show in paused state) */}
        {recordingState === 'paused' && (
          <button className="cancel-button" onClick={handleCancel} aria-label="Cancel">
            <svg viewBox="0 0 20 20" className="icon">
              <path fill="currentColor" fillRule="evenodd"
                d="M16.53 3.47a.75.75 0 0 1 0 1.06L11.06 10l5.47 5.47a.75.75 0 0 1-1.06 1.06L10 11.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L8.94 10 3.47 4.53a.75.75 0 0 1 1.06-1.06L10 8.94l5.47-5.47a.75.75 0 0 1 1.06 0"
                clipRule="evenodd"></path>
            </svg>
            Cancel
          </button>
        )}

        {/* Close Button (only show in idle state) */}
        {recordingState === 'idle' && (
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 20 20" className="icon">
              <path fill="currentColor" fillRule="evenodd"
                d="M16.53 3.47a.75.75 0 0 1 0 1.06L11.06 10l5.47 5.47a.75.75 0 0 1-1.06 1.06L10 11.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L8.94 10 3.47 4.53a.75.75 0 0 1 1.06-1.06L10 8.94l5.47-5.47a.75.75 0 0 1 1.06 0"
                clipRule="evenodd"></path>
            </svg>
          </button>
        )}

        {/* Hidden File Inputs */}
        <input
          ref={imageUploadRef}
          type="file"
          accept="image/jpeg,image/png,image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            // Handle image upload
            if (e.target.files && e.target.files[0]) {
              console.log('Image selected:', e.target.files[0].name);
            }
          }}
        />

        <input
          ref={videoUploadRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            // Handle video upload
            if (e.target.files && e.target.files[0]) {
              console.log('Video selected:', e.target.files[0].name);
            }
          }}
        />
      </div>
    </div>
  );
};

export default VideoRecorder;
