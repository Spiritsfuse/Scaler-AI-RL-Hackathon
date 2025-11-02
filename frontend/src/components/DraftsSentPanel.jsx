import { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { useChatContext } from 'stream-chat-react';
import '../styles/drafts-sent-panel.css';

const DraftsSentPanel = () => {
  const [activeTab, setActiveTab] = useState('drafts');
  const [showInfoBox, setShowInfoBox] = useState(true);
  const { client } = useChatContext();

  // Mock data - in a real app, this would come from local storage or API
  const drafts = [
    {
      id: 1,
      recipient: 'Dhruv Sharma',
      recipientAvatar: null,
      message: 'Wrr',
      timestamp: 'Yesterday',
      channelType: 'dm'
    }
  ];

  const scheduled = [];
  const sent = [];

  const tabs = [
    { id: 'drafts', label: 'Drafts', count: drafts.length },
    { id: 'scheduled', label: 'Scheduled', count: scheduled.length },
    { id: 'sent', label: 'Sent', count: sent.length },
  ];

  const getRecipientInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const handleDraftClick = (draft) => {
    // Navigate to the conversation and load the draft
    console.log('Opening draft:', draft);
    alert(`Opening draft to ${draft.recipient}`);
  };

  const handleDeleteDraft = (e, draftId) => {
    e.stopPropagation();
    // Delete the draft
    console.log('Deleting draft:', draftId);
    alert('Delete draft feature coming soon!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'drafts':
        if (drafts.length === 0) {
          return (
            <div className="drafts-sent-empty">
              <div className="drafts-sent-empty__icon">✏️</div>
              <h3 className="drafts-sent-empty__title">No drafts yet</h3>
              <p className="drafts-sent-empty__text">
                Messages you start but don't send will appear here
              </p>
            </div>
          );
        }
        return (
          <div className="drafts-sent-list">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="drafts-sent-item"
                onClick={() => handleDraftClick(draft)}
              >
                <div className="drafts-sent-item__avatar">
                  {draft.recipientAvatar ? (
                    <img
                      src={draft.recipientAvatar}
                      alt={draft.recipient}
                      className="drafts-avatar-img"
                    />
                  ) : (
                    <div className="drafts-avatar-placeholder">
                      {getRecipientInitial(draft.recipient)}
                    </div>
                  )}
                </div>
                <div className="drafts-sent-item__content">
                  <div className="drafts-sent-item__header">
                    <h3 className="drafts-sent-item__recipient">{draft.recipient}</h3>
                    <span className="drafts-sent-item__timestamp">{draft.timestamp}</span>
                  </div>
                  <p className="drafts-sent-item__message">{draft.message}</p>
                </div>
                <button
                  className="drafts-sent-item__delete"
                  onClick={(e) => handleDeleteDraft(e, draft.id)}
                  aria-label="Delete draft"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'scheduled':
        return (
          <div className="drafts-sent-empty">
            <div className="drafts-sent-empty__icon">📅</div>
            <h3 className="drafts-sent-empty__title">No scheduled messages</h3>
            <p className="drafts-sent-empty__text">
              Messages you schedule to send later will appear here
            </p>
          </div>
        );

      case 'sent':
        return (
          <div className="drafts-sent-empty">
            <div className="drafts-sent-empty__icon">📤</div>
            <h3 className="drafts-sent-empty__title">No sent messages</h3>
            <p className="drafts-sent-empty__text">
              Your sent message history will appear here
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="drafts-sent-panel">
      {/* Header */}
      <div className="drafts-sent-panel__header">
        <h1 className="drafts-sent-panel__title">Drafts & sent</h1>
        <button className="drafts-sent-edit-btn" aria-label="Edit">
          <Edit2 size={16} />
          <span>Edit</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="drafts-sent-panel__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`drafts-sent-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="drafts-sent-tab__count"> {tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Info Box */}
      {showInfoBox && (
        <div className="drafts-sent-info">
          <button
            className="drafts-sent-info__close"
            onClick={() => setShowInfoBox(false)}
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
          <h3 className="drafts-sent-info__title">All your outgoing messages</h3>
          <p className="drafts-sent-info__text">
            Everything you send, draft, and schedule can now be found here.
          </p>
        </div>
      )}

      {/* Content */}
      <div className="drafts-sent-panel__content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DraftsSentPanel;
