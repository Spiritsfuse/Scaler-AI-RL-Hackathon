import { Home, MessageSquare, Bell, FileText, Bookmark, MoreHorizontal, Plus } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import { useChatContext } from 'stream-chat-react';
import { useState, useEffect, useRef } from 'react';
import CreateMenuModal from './CreateMenuModal';
import ProfileMenu from './ProfileMenu';
import MoreMenuModal from './MoreMenuModal';
import '../styles/main-sidebar.css';

const MainSidebar = ({ activeView = 'home', onViewChange, onCreateAction, onOpenProfile }) => {
  const { user } = useUser();
  const { client } = useChatContext();
  const [unreadDMCount, setUnreadDMCount] = useState(0);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const plusButtonRef = useRef(null);
  const userAvatarRef = useRef(null);
  const moreButtonRef = useRef(null);

  const navItems = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: MessageSquare, label: 'DMs', id: 'dms', badge: unreadDMCount },
    { icon: Bell, label: 'Activity', id: 'activity' },
    { icon: FileText, label: 'Files', id: 'files' },
    { icon: Bookmark, label: 'Later', id: 'later' },
    { icon: MoreHorizontal, label: 'More', id: 'more' },
  ];

  // Fetch unread DM count
  useEffect(() => {
    if (!client?.user) return;

    const fetchUnreadCount = async () => {
      try {
        const filter = {
          type: 'messaging',
          members: { $in: [client.user.id] },
          member_count: 2,
        };

        const channels = await client.queryChannels(filter, [{ last_message_at: -1 }], {
          watch: false,
          state: true,
        });

        const totalUnread = channels.reduce((sum, channel) => {
          return sum + (channel.countUnread() || 0);
        }, 0);

        setUnreadDMCount(totalUnread);
      } catch (error) {
        console.error('Error fetching unread DM count:', error);
      }
    };

    fetchUnreadCount();

    // Listen for new messages to update unread count
    const handleEvent = (event) => {
      if (event.type === 'message.new' || event.type === 'message.read') {
        fetchUnreadCount();
      }
    };

    client.on(handleEvent);

    return () => {
      client.off(handleEvent);
    };
  }, [client]);

  // Get user initials for avatar
  const getUserInitial = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Handle plus button click
  const handlePlusClick = () => {
    setIsCreateMenuOpen(!isCreateMenuOpen);
  };

  // Close menu handler
  const handleCloseMenu = () => {
    setIsCreateMenuOpen(false);
  };

  // Handle create action
  const handleCreateAction = (actionId) => {
    if (onCreateAction) {
      onCreateAction(actionId);
    }
  };

  // Handle profile menu toggle
  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Close profile menu
  const handleCloseProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  return (
    <div className="main-sidebar">
      {/* Workspace Logo */}
      <div className="main-sidebar__workspace">
        <div className="workspace-logo">
          SS
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="main-sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              ref={item.id === 'more' ? moreButtonRef : null}
              className={`main-sidebar__nav-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
              title={item.label}
              onClick={() => {
                if (item.id === 'more') {
                  setIsMoreMenuOpen(!isMoreMenuOpen);
                } else {
                  onViewChange?.(item.id);
                }
              }}
            >
              <div className="nav-item-icon-wrapper">
                <Icon className="nav-item-icon" />
                {item.badge > 0 && (
                  <span className="nav-item-badge">{item.badge > 9 ? '9+' : item.badge}</span>
                )}
              </div>
              <span className="nav-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Plus Button */}
      <div className="main-sidebar__plus">
        <button
          ref={plusButtonRef}
          className={`plus-button ${isCreateMenuOpen ? 'rotated' : ''}`}
          onClick={handlePlusClick}
          aria-label="Add"
          title="Add"
          aria-expanded={isCreateMenuOpen}
        >
          <Plus className="plus-icon" />
        </button>
      </div>

      {/* User Avatar */}
      <div className="main-sidebar__user">
        <button
          ref={userAvatarRef}
          className="user-avatar"
          onClick={handleProfileClick}
          aria-label="Open profile menu"
          title="Profile"
        >
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="User avatar" />
          ) : (
            <span>{getUserInitial()}</span>
          )}
        </button>
      </div>

      {/* Create Menu Modal */}
      <CreateMenuModal
        isOpen={isCreateMenuOpen}
        onClose={handleCloseMenu}
        buttonRef={plusButtonRef}
        onActionSelect={handleCreateAction}
      />

      {/* Profile Menu */}
      <ProfileMenu
        isOpen={isProfileMenuOpen}
        onClose={handleCloseProfileMenu}
        anchorRef={userAvatarRef}
        onOpenProfile={onOpenProfile}
      />

      {/* More Menu Modal */}
      <MoreMenuModal
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        buttonRef={moreButtonRef}
      />
    </div>
  );
};

export default MainSidebar;