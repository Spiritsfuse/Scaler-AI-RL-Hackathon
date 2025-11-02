import { useChannelInfo } from '../hooks/useChannelInfo';
import { useUser } from '@clerk/clerk-react';
import '../styles/dm-info-panel.css';

/**
 * DMInfoPanel Component
 * Displays the user profile, action buttons, and welcome message
 * for Direct Message channels (between the header and message list)
 */
const DMInfoPanel = () => {
  const { isDM, isSelfDM, otherUser } = useChannelInfo();
  const { user } = useUser();

  // Only render for DM channels
  if (!isDM) {
    return null;
  }

  /**
   * Get the display user (the person we're DMing with, or self for self-DM)
   */
  const getDisplayUser = () => {
    try {
      if (isSelfDM) {
        return {
          name: user?.fullName || user?.firstName || 'You',
          image: user?.imageUrl,
          title: user?.primaryEmailAddress?.emailAddress || '',
          isSelf: true,
        };
      } else if (otherUser) {
        return {
          name: otherUser.user?.name || otherUser.user?.id,
          image: otherUser.user?.image,
          title: '', // Can be extended with custom user data
          isSelf: false,
          presence: otherUser.user?.online ? 'active' : 'away',
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting display user:', error);
      return null;
    }
  };

  /**
   * Handle viewing profile
   */
  const handleViewProfile = () => {
    try {
      // TODO: Implement profile view modal
      console.log('View profile clicked');
    } catch (error) {
      console.error('Error viewing profile:', error);
    }
  };

  const displayUser = getDisplayUser();

  if (!displayUser) {
    return null;
  }

  return (
    <div className="dm-info-panel">
      {/* Avatar and Name Row */}
      <div className="dm-info-panel__header">
        {/* Large Avatar */}
        <div className="dm-info-panel__avatar">
          {displayUser.image ? (
            <img
              src={displayUser.image}
              alt={displayUser.name}
              className="dm-info-panel__avatar-img"
            />
          ) : (
            <div className="dm-info-panel__avatar-placeholder">
              {displayUser.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name and Presence */}
        <div className="dm-info-panel__info">
          <div className="dm-info-panel__name-row">
            <h1 className="dm-info-panel__name">
              {displayUser.name}
              {displayUser.isSelf && <span className="dm-info-panel__you"> (you)</span>}
            </h1>
            {!displayUser.isSelf && displayUser.presence && (
              <span className={`dm-info-panel__presence dm-info-panel__presence--${displayUser.presence}`} />
            )}
          </div>
          {displayUser.title && (
            <p className="dm-info-panel__title">{displayUser.title}</p>
          )}
        </div>
      </div>

      {/* Welcome Message */}
      <div className="dm-info-panel__welcome">
        {isSelfDM ? (
          <p className="dm-info-panel__welcome-text">
            This is your space. Draft messages, list your to-dos, or keep links and files handy.
            You can also talk to yourself here, but please bear in mind you'll have to supply both sides of the conversation.
          </p>
        ) : (
          <p className="dm-info-panel__welcome-text">
            This conversation is just between you and{' '}
            <span className="dm-info-panel__welcome-name">@{displayUser.name}</span>.
            Take a look at their profile to learn more about them.
          </p>
        )}
      </div>

      {/* View Profile Button */}
      <div className="dm-info-panel__actions">
        <button
          className="dm-info-panel__button dm-info-panel__button--secondary"
          onClick={handleViewProfile}
        >
          {isSelfDM ? 'Edit profile' : 'View profile'}
        </button>
      </div>
    </div>
  );
};

export default DMInfoPanel;
