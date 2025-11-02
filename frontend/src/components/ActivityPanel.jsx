import { useState } from 'react';
import { Bookmark, MoreVertical, Bot } from 'lucide-react';
import '../styles/activity-panel.css';

const ActivityPanel = () => {
  const [showUnreadsOnly, setShowUnreadsOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Sample activity data - in a real app, this would come from an API
  const activities = [
    {
      id: 1,
      type: 'app',
      appName: 'Slackbot',
      sender: 'Slackbot',
      message: "You're good to go! The channel ",
      channelName: '#testing',
      additionalText: ' is now shared between your organization and ',
      workspaceName: 'New Workspace',
      endText: '.',
      timestamp: '2 hours ago',
      isUnread: true,
    },
    {
      id: 2,
      type: 'app',
      appName: 'Slackbot',
      sender: 'Slackbot',
      message: 'Welcome to the workspace! Feel free to explore and start conversations.',
      timestamp: '1 day ago',
      isUnread: false,
    },
  ];

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'mentions', label: 'Mentions' },
    { id: 'threads', label: 'Threads' },
  ];

  const filteredActivities = showUnreadsOnly
    ? activities.filter(activity => activity.isUnread)
    : activities;

  return (
    <div className="activity-panel">
      {/* Header */}
      <div className="activity-panel__header">
        <h1 className="activity-panel__title">Activity</h1>

        {/* Unreads Toggle */}
        <div className="activity-panel__toggle">
          <span className="toggle-label">Unreads</span>
          <button
            className={`toggle-switch ${showUnreadsOnly ? 'active' : ''}`}
            onClick={() => setShowUnreadsOnly(!showUnreadsOnly)}
            aria-label="Toggle unreads filter"
          >
            <span className="toggle-switch__handle"></span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="activity-panel__nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`activity-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="activity-panel__list">
        {filteredActivities.length === 0 ? (
          <div className="activity-panel__empty">
            <p>No {showUnreadsOnly ? 'unread' : ''} activity</p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className={`activity-item ${activity.isUnread ? 'unread' : ''}`}>
      {/* Left: Icon Area */}
      <div className="activity-item__icon">
        <div className="activity-icon-label">Apps</div>
        <div className="activity-icon-avatar">
          <Bot className="activity-icon-image" />
        </div>
      </div>

      {/* Center: Content Area */}
      <div className="activity-item__content">
        <div className="activity-item__sender">{activity.sender}</div>
        <div className="activity-item__message">
          {activity.message}
          {activity.channelName && (
            <strong className="activity-highlight">{activity.channelName}</strong>
          )}
          {activity.additionalText}
          {activity.workspaceName && (
            <strong className="activity-highlight">{activity.workspaceName}</strong>
          )}
          {activity.endText}
        </div>
        <div className="activity-item__timestamp">{activity.timestamp}</div>
      </div>

      {/* Right: Action Area */}
      <div className="activity-item__actions">
        <button
          className={`activity-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={() => setIsBookmarked(!isBookmarked)}
          aria-label="Bookmark"
        >
          <Bookmark
            className="activity-action-icon"
            fill={isBookmarked ? 'currentColor' : 'none'}
          />
        </button>
        <button
          className="activity-action-btn"
          aria-label="More options"
        >
          <MoreVertical className="activity-action-icon" />
        </button>
      </div>
    </div>
  );
};

export default ActivityPanel;
