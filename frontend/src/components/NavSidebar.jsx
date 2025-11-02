import { ChevronDown, ChevronRight, Edit, Headphones, Settings, Star, Hash, Users, MoreVertical, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import { ChannelList } from 'stream-chat-react';
import CustomChannelPreview from './CustomChannelPreview';
import UsersList from './UsersList';
import ChannelOptionsMenu from './ChannelOptionsMenu';
import '../styles/nav-sidebar.css';

const NavSidebar = ({
  chatClient,
  activeChannel,
  setActiveChannel,
  onCreateChannel
}) => {
  const [showChannels, setShowChannels] = useState(true);
  const [showDMs, setShowDMs] = useState(true);
  const [showStarred, setShowStarred] = useState(true);
  const [showChannelOptions, setShowChannelOptions] = useState(false);
  const channelOptionsButtonRef = useRef(null);

  const workspaceName = "Scaler School Of Tech...";

  // Safe toggle handlers with error handling
  const handleToggleChannels = () => {
    try {
      setShowChannels(!showChannels);
    } catch (error) {
      console.error('Error toggling channels section:', error);
    }
  };

  const handleToggleDMs = () => {
    try {
      setShowDMs(!showDMs);
    } catch (error) {
      console.error('Error toggling DMs section:', error);
    }
  };

  const handleToggleStarred = () => {
    try {
      setShowStarred(!showStarred);
    } catch (error) {
      console.error('Error toggling starred section:', error);
    }
  };

  const handleCreateChannel = () => {
    try {
      if (onCreateChannel) {
        onCreateChannel();
      }
    } catch (error) {
      console.error('Error opening create channel modal:', error);
    }
  };

  const handleToggleChannelOptions = (e) => {
    try {
      e.stopPropagation();
      setShowChannelOptions(!showChannelOptions);
    } catch (error) {
      console.error('Error toggling channel options menu:', error);
    }
  };

  const handleCloseChannelOptions = () => {
    try {
      setShowChannelOptions(false);
    } catch (error) {
      console.error('Error closing channel options menu:', error);
    }
  };

  return (
    <div className="nav-sidebar">
      {/* Workspace Header */}
      <div className="nav-sidebar__header">
        <div className="workspace-header-title">
          <button className="workspace-selector">
            <span className="workspace-name">{workspaceName}</span>
            <ChevronDown className="workspace-icon" />
          </button>
        </div>
        <div className="workspace-header-controls">
          <button
            className="header-control-btn"
            aria-label="Manage my sidebar"
            title="Manage my sidebar"
          >
            <Settings className="control-icon" />
          </button>
          <button
            className="header-control-btn"
            aria-label="New message"
            title="New message"
          >
            <Edit className="control-icon" />
          </button>
        </div>
      </div>

      {/* Navigation Content */}
      <div className="nav-sidebar__content">
        {/* Quick Actions */}
        <div className="nav-section nav-section-quick">
          <button className="nav-item">
            <Headphones className="nav-item-icon" />
            <span>Huddles</span>
          </button>
          <button className="nav-item">
            <Users className="nav-item-icon" />
            <span>Directories</span>
          </button>
        </div>

        {/* Divider */}
        <div className="nav-divider"></div>

        {/* Starred Section */}
        <div className="nav-section">
          <button
            className="section-header section-header-with-icon"
            onClick={handleToggleStarred}
          >
            <div className="section-header-leading">
              <Star className="section-header-emoji" fill="currentColor" />
              <ChevronRight className={`section-header-chevron ${showStarred ? 'expanded' : ''}`} />
            </div>
            <span className="section-header-text">Starred</span>
          </button>
          {showStarred && (
            <div className="section-content">
              <div className="starred-placeholder">
                Drag and drop important stuff here
              </div>
            </div>
          )}
        </div>

        {/* Channels Section */}
        <div className="nav-section">
          <div className="section-header-wrapper">
            <button
              className="section-header"
              onClick={handleToggleChannels}
            >
              <ChevronRight className={`section-header-chevron ${showChannels ? 'expanded' : ''}`} />
              <span className="section-header-text">Channels</span>
            </button>

            <div className="section-header-actions">
              <button
                className="section-header-action-btn"
                onClick={handleToggleChannelOptions}
                aria-label="Channel options"
                title="Channel options"
                ref={channelOptionsButtonRef}
              >
                <MoreVertical className="section-action-icon" />
              </button>
            </div>

            {showChannelOptions && (
              <ChannelOptionsMenu
                onCreateChannel={handleCreateChannel}
                onClose={handleCloseChannelOptions}
                buttonRef={channelOptionsButtonRef}
              />
            )}
          </div>

          {showChannels && (
            <div className="section-content channels-section-content">
              {chatClient ? (
                <ChannelList
                  filters={{
                    type: 'messaging',
                    members: { $in: [chatClient.user?.id] }
                  }}
                  options={{ state: true, watch: true }}
                  Preview={({ channel }) => (
                    <CustomChannelPreview
                      channel={channel}
                      activeChannel={activeChannel}
                      setActiveChannel={setActiveChannel}
                    />
                  )}
                  List={({ children, loading, error }) => (
                    <div className="channels-list">
                      {loading && <div className="loading-text">Loading channels...</div>}
                      {error && <div className="error-text">Error loading channels</div>}
                      {children}
                    </div>
                  )}
                />
              ) : (
                <div className="loading-text">Connecting...</div>
              )}
            </div>
          )}
        </div>

        {/* Direct Messages Section */}
        <div className="nav-section">
          <div className="section-header-wrapper">
            <button
              className="section-header"
              onClick={handleToggleDMs}
            >
              <ChevronRight className={`section-header-chevron ${showDMs ? 'expanded' : ''}`} />
              <span className="section-header-text">Direct messages</span>
            </button>

            <div className="section-header-actions">
              <button
                className="section-header-action-btn"
                onClick={() => alert('Open new message modal')}
                aria-label="New direct message"
                title="New direct message"
              >
                <Plus className="section-action-icon" />
              </button>
              <button
                className="section-header-action-btn"
                aria-label="Direct messages options"
                title="Direct messages options"
              >
                <MoreVertical className="section-action-icon" />
              </button>
            </div>
          </div>

          {showDMs && (
            <div className="section-content">
              <UsersList activeChannel={activeChannel} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavSidebar;