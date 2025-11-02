import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Clock,
  Bell,
  ChevronDown,
  MoreVertical,
  Mail,
  Camera,
  X
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import SetStatusModal from './SetStatusModal';
import '../styles/profile-edit.css';

const ProfileEdit = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [aboutText, setAboutText] = useState('');

  // Initialize data from Clerk user
  useEffect(() => {
    if (user) {
      setFullName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
      setEmail(user.primaryEmailAddress?.emailAddress || '');
    }
  }, [user]);

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.username) {
      return user.username;
    }
    return fullName || 'User';
  };

  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSaveName = () => {
    // In production, update via Clerk API
    console.log('Saving name:', fullName, displayName);
    setIsEditingName(false);
  };

  const handleSaveContact = () => {
    // In production, update via Clerk API
    console.log('Saving contact:', email, phone);
    setIsEditingContact(false);
  };

  const handleSaveAbout = () => {
    console.log('Saving about:', startDate, aboutText);
    setIsEditingAbout(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, upload to Clerk
      console.log('Uploading image:', file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-edit-container">
      <div className="profile-edit">
        {/* Header */}
        <div className="profile-edit__header">
          <button className="header-back-btn" onClick={onClose} aria-label="Go back">
            <ChevronLeft size={20} />
          </button>
          <h1 className="header-title">Profile</h1>
          <button className="header-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="profile-edit__content">
          {/* Profile Image Section */}
          <div className="profile-image-section">
            <div className="profile-image-wrapper">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <span>{getUserInitial()}</span>
                </div>
              )}
              <label className="profile-image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="profile-image-input"
                />
                <div className="upload-overlay">
                  <Camera size={24} />
                </div>
              </label>
            </div>
          </div>

          {/* Name Section */}
          <div className="profile-section">
            {isEditingName ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Display name (optional)</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="form-input"
                    placeholder="Enter display name"
                  />
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setIsEditingName(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSaveName}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="section-header">
                  <h2 className="profile-name">{getUserName()}</h2>
                  <button className="edit-link" onClick={() => setIsEditingName(true)}>
                    Edit
                  </button>
                </div>
                <button className="add-link">
                  <Plus size={16} />
                  <span>Add name pronunciation</span>
                </button>
              </>
            )}
          </div>

          {/* Status and Time */}
          <div className="profile-status-section">
            <div className="status-item">
              <Bell size={16} className="status-icon" />
              <span className="status-text">Active, notifications on</span>
            </div>
            <div className="status-item">
              <Clock size={16} className="status-icon" />
              <span className="status-text">{getCurrentTime()} local time</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="profile-actions">
            <button className="action-btn" onClick={() => setIsStatusModalOpen(true)}>
              Set a status
            </button>
            <button className="action-btn">
              <span>View as</span>
              <ChevronDown size={16} />
            </button>
            <button className="action-btn icon-only">
              <MoreVertical size={18} />
            </button>
          </div>

          {/* Contact Information */}
          <div className="profile-section">
            <div className="section-header">
              <h3 className="section-title">Contact information</h3>
              {!isEditingContact && (
                <button className="edit-link" onClick={() => setIsEditingContact(true)}>
                  Edit
                </button>
              )}
            </div>

            {isEditingContact ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Phone number (optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    placeholder="Enter your phone"
                  />
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setIsEditingContact(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSaveContact}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="section-content">
                <div className="info-item">
                  <Mail size={18} className="info-icon" />
                  <a href={`mailto:${email || user?.primaryEmailAddress?.emailAddress}`} className="info-link">
                    {email || user?.primaryEmailAddress?.emailAddress || 'No email'}
                  </a>
                </div>
                {phone && (
                  <div className="info-item">
                    <span className="info-text">{phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* About Me */}
          <div className="profile-section">
            <div className="section-header">
              <h3 className="section-title">About me</h3>
              {!isEditingAbout && (
                <button className="edit-link" onClick={() => setIsEditingAbout(true)}>
                  Edit
                </button>
              )}
            </div>

            {isEditingAbout ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Start date (optional)</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>About (optional)</label>
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="form-textarea"
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setIsEditingAbout(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSaveAbout}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="section-content">
                {!startDate && !aboutText ? (
                  <button className="add-link">
                    <Plus size={16} />
                    <span>Add start date</span>
                  </button>
                ) : (
                  <>
                    {startDate && (
                      <div className="info-item">
                        <span className="info-label">Start date:</span>
                        <span className="info-text">{new Date(startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {aboutText && (
                      <div className="info-item">
                        <p className="info-text">{aboutText}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Set Status Modal */}
      <SetStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSave={(status) => console.log('Status updated:', status)}
        currentStatus=""
      />
    </div>
  );
};

export default ProfileEdit;
