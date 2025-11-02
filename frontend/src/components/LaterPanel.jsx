import { useState } from 'react';
import { Plus, Bookmark, MoreVertical, Clock, CheckCircle, Archive, MessageSquare, Hash } from 'lucide-react';
import '../styles/later-panel.css';

const LaterPanel = () => {
  const [activeTab, setActiveTab] = useState('inprogress');

  // Sample later items - in a real app, this would come from an API
  const laterItems = [
    {
      id: 1,
      type: 'message',
      channelName: '#general',
      sender: 'John Doe',
      message: 'Hey team, can we discuss the new feature implementation tomorrow?',
      timestamp: '2 hours ago',
      savedAt: 'Today at 2:30 PM',
      status: 'inprogress',
    },
    {
      id: 2,
      type: 'message',
      channelName: '#design',
      sender: 'Jane Smith',
      message: 'Here are the new mockups for the dashboard redesign',
      timestamp: '1 day ago',
      savedAt: 'Yesterday at 10:15 AM',
      status: 'inprogress',
    },
    {
      id: 3,
      type: 'reminder',
      reminderText: 'Follow up with client about project timeline',
      dueDate: 'Tomorrow at 9:00 AM',
      status: 'inprogress',
    },
  ];

  const tabs = [
    { id: 'inprogress', label: 'In progress' },
    { id: 'archived', label: 'Archived' },
    { id: 'completed', label: 'Completed' },
  ];

  const filteredItems = laterItems.filter(item => item.status === activeTab);

  return (
    <div className="later-panel">
      {/* Header */}
      <div className="later-panel__header">
        <h1 className="later-panel__title">Later</h1>

        {/* New Reminder Button */}
        <button
          className="later-panel__add-btn"
          aria-label="New reminder"
          title="New reminder"
        >
          <Plus className="later-add-icon" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="later-panel__nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`later-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <span className="later-nav-tab__content">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="later-panel__content">
        {filteredItems.length === 0 ? (
          <div className="later-panel__empty">
            <div className="later-empty__icon">📦</div>
            <div className="later-empty__title">
              Out of sight, but not out of mind
            </div>
            <div className="later-empty__description">
              No more wasting time searching for messages. Archive messages you come back to often.
            </div>
            <div className="later-empty__illustration">
              {/* Placeholder for illustration */}
              <div className="later-empty__illustration-placeholder">
                <Bookmark size={64} strokeWidth={1} />
              </div>
            </div>
          </div>
        ) : (
          <div className="later-panel__list">
            {filteredItems.map(item => (
              <LaterItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LaterItem = ({ item }) => {
  const [isArchived, setIsArchived] = useState(false);

  if (item.type === 'reminder') {
    return (
      <div className="later-item later-item--reminder">
        {/* Left: Icon */}
        <div className="later-item__icon">
          <div className="later-icon-wrapper later-icon-wrapper--reminder">
            <Clock className="later-icon" />
          </div>
        </div>

        {/* Center: Content */}
        <div className="later-item__content">
          <div className="later-item__reminder-text">{item.reminderText}</div>
          <div className="later-item__meta">
            <Clock className="later-meta-icon" size={14} />
            <span className="later-item__due-date">{item.dueDate}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="later-item__actions">
          <button
            className="later-action-btn"
            onClick={() => setIsArchived(!isArchived)}
            aria-label="Mark as complete"
          >
            <CheckCircle className="later-action-icon" />
          </button>
          <button
            className="later-action-btn"
            aria-label="More options"
          >
            <MoreVertical className="later-action-icon" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="later-item later-item--message">
      {/* Left: Icon */}
      <div className="later-item__icon">
        <div className="later-icon-wrapper">
          <Hash className="later-icon" />
        </div>
      </div>

      {/* Center: Content */}
      <div className="later-item__content">
        <div className="later-item__header">
          <span className="later-item__channel">{item.channelName}</span>
          <span className="later-item__timestamp">{item.savedAt}</span>
        </div>
        <div className="later-item__sender">{item.sender}</div>
        <div className="later-item__message">{item.message}</div>
        <div className="later-item__meta">
          <MessageSquare className="later-meta-icon" size={14} />
          <span className="later-item__original-time">{item.timestamp}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="later-item__actions">
        <button
          className={`later-action-btn ${isArchived ? 'archived' : ''}`}
          onClick={() => setIsArchived(!isArchived)}
          aria-label="Archive"
        >
          <Archive className="later-action-icon" />
        </button>
        <button
          className="later-action-btn"
          aria-label="More options"
        >
          <MoreVertical className="later-action-icon" />
        </button>
      </div>
    </div>
  );
};

export default LaterPanel;
