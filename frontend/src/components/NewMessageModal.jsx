import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useChatContext } from 'stream-chat-react';
import '../styles/new-message-modal.css';

const NewMessageModal = ({ isOpen, onClose, onMessageCreated }) => {
  const { client } = useChatContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedUsers([]);
      setMessage('');
      setUsers([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!client || !searchQuery) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await client.queryUsers(
          {
            id: { $ne: client.userID },
            $or: [
              { name: { $autocomplete: searchQuery } },
              { id: { $autocomplete: searchQuery } },
            ],
          },
          { id: 1 },
          { limit: 8 }
        );
        setUsers(response.users);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, client]);

  const handleSelectUser = (user) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchQuery('');
      setUsers([]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleSendMessage = async () => {
    if (selectedUsers.length === 0 || !message.trim()) return;

    try {
      setIsLoading(true);
      const members = [client.userID, ...selectedUsers.map(u => u.id)];

      const channel = client.channel('messaging', {
        members,
      });

      await channel.create();
      await channel.sendMessage({ text: message });

      if (onMessageCreated) {
        onMessageCreated(channel);
      }

      onClose();
    } catch (error) {
      console.error('Error creating message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && message.trim()) {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-message-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="new-message-modal__header">
          <h2 className="modal-title">New message</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* To Field */}
        <div className="new-message-modal__to">
          <label className="to-label">To:</label>
          <div className="to-input-wrapper">
            {selectedUsers.map(user => (
              <div key={user.id} className="selected-user-tag">
                <span>{user.name || user.id}</span>
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="remove-user-btn"
                  aria-label={`Remove ${user.name || user.id}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedUsers.length === 0 ? "Search for people..." : ""}
              className="to-input"
              autoFocus
            />
          </div>
        </div>

        {/* User Search Results */}
        {users.length > 0 && (
          <div className="user-search-results">
            {users.map(user => (
              <button
                key={user.id}
                className="user-result-item"
                onClick={() => handleSelectUser(user)}
              >
                <div className="user-avatar-small">
                  {user.image ? (
                    <img src={user.image} alt={user.name || user.id} />
                  ) : (
                    <span>{(user.name || user.id).charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name || user.id}</div>
                  {user.id && <div className="user-id">@{user.id}</div>}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Message Input */}
        <div className="new-message-modal__body">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            className="message-textarea"
            rows={6}
            disabled={isLoading}
          />
        </div>

        {/* Footer */}
        <div className="new-message-modal__footer">
          <div className="footer-hint">
            Press ⌘ + Enter to send
          </div>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSendMessage}
              disabled={selectedUsers.length === 0 || !message.trim() || isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
