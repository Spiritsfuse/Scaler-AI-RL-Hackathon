import { ChevronDown, ChevronRight, Edit, Headphones, Book, Hash, Users, MoreVertical } from 'lucide-react';
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
        <button className="workspace-selector">
          <span className="workspace-name">{workspaceName}</span>
          <ChevronDown className="workspace-icon" />
        </button>
        <button
          className="new-message-btn"
          aria-label="New message"
          title="New message"
        >
          <Edit className="edit-icon" />
        </button>
      </div>

      {/* Navigation Content */}
      <div className="nav-sidebar__content">
        {/* Quick Actions */}
        <div className="nav-section">
          <button className="nav-item">
            <Headphones className="nav-item-icon" />
            <span>Huddles</span>
          </button>
          <button className="nav-item">
            <Book className="nav-item-icon" />
            <span>Directories</span>
          </button>
        </div>

        {/* Starred Section */}
        <div className="nav-section">
          <button
            className="section-header"
            onClick={handleToggleStarred}
          >
            {showStarred ? (
              <ChevronDown className="section-header-icon" />
            ) : (
              <ChevronRight className="section-header-icon" />
            )}
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
              {showChannels ? (
                <ChevronDown className="section-header-icon" />
              ) : (
                <ChevronRight className="section-header-icon" />
              )}
              <span className="section-header-text">Channels</span>
            </button>
            
            <button 
              className="section-header-options"
              onClick={handleToggleChannelOptions}
              aria-label="Channel options"
              title="Channel options"
              ref={channelOptionsButtonRef}
            >
              <MoreVertical className="section-header-options-icon" />
            </button>

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
          <button
            className="section-header"
            onClick={handleToggleDMs}
          >
            {showDMs ? (
              <ChevronDown className="section-header-icon" />
            ) : (
              <ChevronRight className="section-header-icon" />
            )}
            <span className="section-header-text">Direct messages</span>
          </button>
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