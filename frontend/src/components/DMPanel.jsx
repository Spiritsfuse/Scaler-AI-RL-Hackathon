import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { useChatContext } from 'stream-chat-react';
import DMItem from './DMItem';
import '../styles/dm-panel.css';

const DMPanel = ({ activeChannel, setActiveChannel }) => {
  const [showUnreadsOnly, setShowUnreadsOnly] = useState(false);
  const [dmChannels, setDmChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { client } = useChatContext();

  useEffect(() => {
    if (!client?.user) return;

    const fetchDMChannels = async () => {
      try {
        setIsLoading(true);
        // Query for direct message channels (type: messaging with exactly 2 members)
        const filter = {
          type: 'messaging',
          members: { $in: [client.user.id] },
          member_count: 2, // Only 1-on-1 DMs
        };

        const sort = [{ last_message_at: -1 }];
        const channels = await client.queryChannels(filter, sort, {
          watch: true,
          state: true,
        });

        // Filter out channels without any messages
        const channelsWithMessages = channels.filter(
          (channel) => channel.state.messages.length > 0
        );

        setDmChannels(channelsWithMessages);
      } catch (error) {
        console.error('Error fetching DM channels:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDMChannels();

    // Set up event listeners for new messages
    const handleEvent = (event) => {
      if (event.type === 'message.new' || event.type === 'message.updated') {
        fetchDMChannels();
      }
    };

    client.on(handleEvent);

    return () => {
      client.off(handleEvent);
    };
  }, [client]);

  const getOtherUser = (channel) => {
    const members = Object.values(channel.state.members);
    return members.find((member) => member.user?.id !== client.user.id)?.user;
  };

  const getLastMessage = (channel) => {
    const messages = channel.state.messages;
    if (messages.length === 0) return '';

    const lastMessage = messages[messages.length - 1];
    const isOwnMessage = lastMessage.user?.id === client.user.id;
    const prefix = isOwnMessage ? 'You: ' : '';

    return prefix + (lastMessage.text || 'Attachment');
  };

  const getTimestamp = (channel) => {
    const lastMessage = channel.state.messages[channel.state.messages.length - 1];
    if (!lastMessage?.created_at) return '';

    const date = new Date(lastMessage.created_at);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? 's' : ''}`;
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDMClick = async (channel) => {
    try {
      // Make sure the channel is watched before setting it as active
      await channel.watch();
      setActiveChannel(channel);
    } catch (error) {
      console.error('Error opening DM:', error);
    }
  };

  // Filter DMs if "Unreads" toggle is on
  const displayedChannels = showUnreadsOnly
    ? dmChannels.filter((channel) => channel.countUnread() > 0)
    : dmChannels;

  return (
    <div className="dm-panel">
      {/* Header */}
      <div className="dm-panel__header">
        <h2 className="dm-panel__title">Direct messages</h2>
        <div className="dm-panel__toggle">
          <span className="dm-panel__toggle-label">Unreads</span>
          <button
            onClick={() => setShowUnreadsOnly(!showUnreadsOnly)}
            className={`toggle-switch ${showUnreadsOnly ? 'active' : ''}`}
            aria-label="Toggle unreads filter"
          >
            <span className="toggle-switch__slider" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="dm-panel__content">
        {/* Add Coworkers */}
        <div className="dm-panel__callout">
          <div className="dm-panel__callout-content">
            <UserPlus className="dm-panel__callout-icon" />
            <div>
              <p className="dm-panel__callout-title">Anyone missing?</p>
              <p className="dm-panel__callout-text">
                Add your whole team and get the conversation started.
              </p>
              <button className="dm-panel__callout-button">
                Add Coworkers
              </button>
            </div>
          </div>
        </div>

        {/* DM List */}
        <div className="dm-panel__list">
          {isLoading ? (
            <p className="dm-panel__empty">Loading conversations...</p>
          ) : displayedChannels.length > 0 ? (
            displayedChannels.map((channel) => {
              const otherUser = getOtherUser(channel);
              const isActive = activeChannel?.id === channel.id;

              return (
                <DMItem
                  key={channel.id}
                  name={otherUser?.name || otherUser?.id || 'Unknown User'}
                  message={getLastMessage(channel)}
                  time={getTimestamp(channel)}
                  unreadCount={channel.countUnread()}
                  avatar={otherUser?.image}
                  onClick={() => handleDMClick(channel)}
                  isActive={isActive}
                />
              );
            })
          ) : (
            <p className="dm-panel__empty">
              {showUnreadsOnly ? 'No unread messages' : 'No direct messages yet'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DMPanel;
