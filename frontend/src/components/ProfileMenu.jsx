import { useState, useEffect, useRef } from 'react';
import { Smile, ChevronRight, Moon, Bell, User, Settings, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import SetStatusModal from './SetStatusModal';
import '../styles/profile-menu.css';

const ProfileMenu = ({ isOpen, onClose, anchorRef, onOpenProfile }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [userStatus, setUserStatus] = useState({ emoji: '', text: '' });
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAway, setIsAway] = useState(false);
  const [notificationsPaused, setNotificationsPaused] = useState(false);
  const menuRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  const handleSetAway = () => {
    setIsAway(!isAway);
  };

  const handleToggleNotifications = () => {
    setNotificationsPaused(!notificationsPaused);
  };

  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  const handleSaveStatus = (status) => {
    setUserStatus(status);
    console.log('Status saved:', status);
  };

  const handleProfile = () => {
    if (onOpenProfile) {
      onOpenProfile();
    }
    onClose();
  };

  const handlePreferences = () => {
    alert('Preferences feature coming soon!');
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitial = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

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
    return 'User';
  };

  if (!isOpen) return null;

  return (
    <div ref={menuRef} className="profile-menu">
      {/* Header: User Details */}
      <div className="profile-menu__header">
        <div className="profile-header__avatar">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt={getUserName()} />
          ) : (
            <div className="profile-avatar-placeholder">
              <span>{getUserInitial()}</span>
            </div>
          )}
          <div className="avatar-status-indicator active"></div>
        </div>
        <div className="profile-header__info">
          <div className="profile-name">{getUserName()}</div>
          <div className="profile-status">
            <span className="status-dot active"></span>
            <span className="status-text">{isAway ? 'Away' : 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Update Status */}
      <div className="profile-menu__section">
        <button className="status-input" onClick={handleOpenStatusModal}>
          <div className="status-icon-wrapper">
            {userStatus.emoji ? (
              <span className="status-emoji-display">{userStatus.emoji}</span>
            ) : (
              <Smile className="status-icon" size={20} />
            )}
          </div>
          <span className="status-input-text">
            {userStatus.text || 'Update your status'}
          </span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="profile-menu__section">
        <button className="profile-menu__item" onClick={handleSetAway}>
          <div className="menu-item-content">
            <Moon className="menu-item-icon" size={18} />
            <span>Set yourself as {isAway ? 'active' : 'away'}</span>
          </div>
        </button>

        <button className="profile-menu__item" onClick={handleToggleNotifications}>
          <div className="menu-item-content">
            <Bell className="menu-item-icon" size={18} />
            <span>Pause notifications</span>
          </div>
          <div className="menu-item-right">
            <span className="notification-status">
              {notificationsPaused ? 'Off' : 'On'}
            </span>
            <ChevronRight className="menu-item-chevron" size={16} />
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="profile-menu__divider"></div>

      {/* Settings */}
      <div className="profile-menu__section">
        <button className="profile-menu__item" onClick={handleProfile}>
          <div className="menu-item-content">
            <User className="menu-item-icon" size={18} />
            <span>Profile</span>
          </div>
        </button>

        <button className="profile-menu__item" onClick={handlePreferences}>
          <div className="menu-item-content">
            <Settings className="menu-item-icon" size={18} />
            <span>Preferences</span>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="profile-menu__divider"></div>

      {/* Sign Out */}
      <div className="profile-menu__section">
        <button className="profile-menu__item profile-menu__item--signout" onClick={handleSignOut}>
          <div className="menu-item-content">
            <LogOut className="menu-item-icon" size={18} />
            <span>Sign out of workspace</span>
          </div>
        </button>
      </div>

      {/* Set Status Modal */}
      <SetStatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        onSave={handleSaveStatus}
        currentStatus={userStatus.text}
      />
    </div>
  );
};

export default ProfileMenu;
