import { HashIcon } from "lucide-react";
import '../styles/custom-channel-preview.css';

const CustomChannelPreview = ({ channel, setActiveChannel, activeChannel }) => {
  try {
    // Validate inputs
    if (!channel) {
      console.warn('CustomChannelPreview: channel prop is required');
      return null;
    }

    const isActive = activeChannel && activeChannel.id === channel.id;
    const isDM = channel.data?.member_count === 2 && channel.data?.id?.includes("user_");

    // Don't render DM channels in the channels list
    if (isDM) return null;

    let unreadCount = 0;
    try {
      unreadCount = channel.countUnread ? channel.countUnread() : 0;
    } catch (err) {
      console.error('Error counting unread messages:', err);
    }

    // Get channel name or ID
    const channelName = channel.data?.name || channel.data?.id || 'Unnamed Channel';

    const handleChannelClick = () => {
      try {
        if (setActiveChannel) {
          setActiveChannel(channel);
        }
      } catch (err) {
        console.error('Error setting active channel:', err);
      }
    };

    return (
      <div
        className="p-channel_sidebar__static_list__item"
        role="treeitem"
        tabIndex={0}
        data-channel-id={channel.id}
      >
        <button
          onClick={handleChannelClick}
          className={`p-channel_sidebar__channel ${isActive ? 'p-channel_sidebar__channel--selected' : ''}`}
          data-qa="channel-sidebar-channel"
          aria-label={`Channel ${channelName}`}
        >
          <div className="p-channel_sidebar__channel_icon_prefix">
            <HashIcon className="channel-icon" aria-hidden="true" />
          </div>
          
          <span 
            className="p-channel_sidebar__name" 
            dir="auto"
            data-qa={`channel_sidebar_name_${channelName}`}
          >
            <span>{channelName}</span>
          </span>

          {unreadCount > 0 && (
            <span className="p-channel_sidebar__channel_suffix">
              <span className="channel-preview-badge">
                {unreadCount}
              </span>
            </span>
          )}
        </button>
      </div>
    );
  } catch (error) {
    console.error('Error rendering CustomChannelPreview:', error);
    return null;
  }
};

export default CustomChannelPreview;