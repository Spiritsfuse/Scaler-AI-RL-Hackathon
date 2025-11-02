import { useState, useEffect } from 'react';
import { X, Smile } from 'lucide-react';
import '../styles/set-status-modal.css';

const SetStatusModal = ({ isOpen, onClose, onSave, currentStatus = '' }) => {
  const [statusText, setStatusText] = useState(currentStatus);
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStatusText(currentStatus);
      setSelectedPreset(null);
    }
  }, [isOpen, currentStatus]);

  // Preset statuses
  const presetStatuses = [
    { id: 1, emoji: '🗓️', text: 'In a meeting', duration: '1 hour' },
    { id: 2, emoji: '🚌', text: 'Commuting', duration: '30 minutes' },
    { id: 3, emoji: '🤒', text: 'Out sick', duration: 'Today' },
    { id: 4, emoji: '🌴', text: 'Vacationing', duration: "Don't clear" },
    { id: 5, emoji: '🏡', text: 'Working remotely', duration: 'Today' },
  ];

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset.id);
    setSelectedEmoji(preset.emoji);
    setStatusText(preset.text);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        emoji: selectedEmoji,
        text: statusText,
        preset: selectedPreset,
      });
    }
    onClose();
  };

  const handleCancel = () => {
    setStatusText(currentStatus);
    setSelectedPreset(null);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="set-status-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="set-status-modal__header">
          <h1 className="modal-title">Set a status</h1>
          <button className="modal-close-btn" onClick={handleCancel} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="set-status-modal__content">
          {/* Status Input */}
          <div className="status-input-section">
            <div className="status-input-container">
              <button
                className="emoji-picker-btn"
                aria-label="Select emoji"
                onClick={() => {
                  // In production, this would open an emoji picker
                  console.log('Open emoji picker');
                }}
              >
                <span className="emoji-display">{selectedEmoji}</span>
              </button>
              <input
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's your status?"
                className="status-text-input"
                autoFocus
              />
            </div>
          </div>

          {/* Suggested Statuses */}
          <div className="status-presets-section">
            <h3 className="preset-section-title">For workspace</h3>
            <div className="status-presets-list">
              {presetStatuses.map((preset) => (
                <button
                  key={preset.id}
                  className={`status-preset-item ${selectedPreset === preset.id ? 'active' : ''}`}
                  onClick={() => handlePresetClick(preset)}
                >
                  <span className="preset-emoji">{preset.emoji}</span>
                  <span className="preset-text">{preset.text}</span>
                  <span className="preset-duration">{preset.duration}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Automatically updates section */}
          <div className="status-presets-section">
            <h3 className="preset-section-title">Automatically updates</h3>
            <div className="status-presets-list">
              <button className="status-preset-item calendar-item">
                <div className="preset-emoji calendar-icon">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285F4'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z'/%3E%3C/svg%3E"
                    alt="Calendar"
                    width="22"
                    height="22"
                  />
                </div>
                <span className="preset-text">In a meeting</span>
                <span className="preset-duration">Based on your Google Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="set-status-modal__footer">
          <a
            href="#"
            className="edit-suggestions-link"
            onClick={(e) => {
              e.preventDefault();
              console.log('Edit suggestions');
            }}
          >
            Edit suggestions for workspace
          </a>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={!statusText.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetStatusModal;
