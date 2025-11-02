import { useState, useEffect } from 'react';
import { Search, X, Users as UsersIcon } from 'lucide-react';
import { useChatContext } from 'stream-chat-react';
import { useUser } from '@clerk/clerk-react';
import '../styles/directories-panel.css';

const DirectoriesPanel = ({ onInvitePeople }) => {
  const [activeTab, setActiveTab] = useState('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(true);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { client } = useChatContext();
  const { user: currentUser } = useUser();

  const tabs = [
    { id: 'people', label: 'People', icon: '👤' },
    { id: 'channels', label: 'Channels', icon: '#' },
    { id: 'usergroups', label: 'User Groups', icon: '👥' },
    { id: 'external', label: 'External', icon: '🔗' },
  ];

  useEffect(() => {
    if (activeTab === 'people') {
      fetchUsers();
    }
  }, [activeTab, client]);

  const fetchUsers = async () => {
    if (!client?.user) return;

    try {
      setIsLoading(true);
      const response = await client.queryUsers(
        { id: { $ne: client.user.id } },
        { name: 1 },
        { limit: 50 }
      );

      const usersOnly = response.users.filter((user) => !user.id.startsWith("recording-"));
      setUsers(usersOnly);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name || user.id;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getUserInitial = (user) => {
    const name = user.name || user.id;
    return name.charAt(0).toUpperCase();
  };

  const handleInvitePeople = () => {
    if (onInvitePeople) {
      onInvitePeople();
    } else {
      alert('Invite people feature coming soon!');
    }
  };

  return (
    <div className="directories-panel">
      {/* Header */}
      <div className="directories-panel__header">
        <h1 className="directories-panel__title">Directories</h1>
      </div>

      {/* Tabs */}
      <div className="directories-panel__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`directories-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="directories-tab__icon">{tab.icon}</span>
            <span className="directories-tab__label">{tab.label}</span>
          </button>
        ))}
        <button className="directories-tab-more">
          More
          <span className="directories-tab-more__arrow">▼</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="directories-panel__search">
        <div className="directories-search-bar">
          <Search className="directories-search-icon" size={18} />
          <input
            type="text"
            className="directories-search-input"
            placeholder="Search for people"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="directories-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button className="directories-invite-btn" onClick={handleInvitePeople}>
          Invite People
        </button>
      </div>

      {/* Invite Dialog */}
      {showInviteDialog && (
        <div className="directories-invite-dialog">
          <button
            className="directories-invite-dialog__close"
            onClick={() => setShowInviteDialog(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <h2 className="directories-invite-dialog__title">
            Invite your team to Slack
          </h2>
          <p className="directories-invite-dialog__text">
            Bring your team members into Slack to start working better together.
            Send invites via email, or get a handy link to share.
          </p>
          <button
            className="directories-invite-dialog__btn"
            onClick={handleInvitePeople}
          >
            Invite people
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="directories-panel__filters">
        <button className="directories-filter-btn">
          Title <span className="filter-arrow">▼</span>
        </button>
        <button className="directories-filter-btn">
          Location <span className="filter-arrow">▼</span>
        </button>
        <button className="directories-filter-btn-icon">
          <span>🔍</span> Filters
        </button>
        <div className="directories-filter-sort">
          <select className="directories-sort-select">
            <option>Most recommended</option>
            <option>Name (A-Z)</option>
            <option>Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="directories-panel__content">
        {activeTab === 'people' && (
          <>
            {isLoading ? (
              <div className="directories-loading">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="directories-empty">
                {searchQuery ? 'No users found matching your search' : 'No users found'}
              </div>
            ) : (
              <div className="directories-users-grid">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="directories-user-card">
                    <div className="directories-user-card__avatar">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || user.id}
                          className="directories-user-avatar-img"
                        />
                      ) : (
                        <div className="directories-user-avatar-placeholder">
                          {getUserInitial(user)}
                        </div>
                      )}
                    </div>
                    <div className="directories-user-card__info">
                      <h3 className="directories-user-card__name">
                        {user.name || user.id}
                        {user.id === currentUser?.id && (
                          <span className="directories-user-badge">That's you!</span>
                        )}
                      </h3>
                      <div className="directories-user-card__status">
                        <span className={`directories-status-dot ${user.online ? 'online' : 'offline'}`}></span>
                        <span className="directories-status-text">
                          {user.online ? 'Active' : 'Away'}
                        </span>
                      </div>
                    </div>
                    <button className="directories-user-card__edit" aria-label="Edit">
                      ✏️ Edit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'channels' && (
          <div className="directories-placeholder">
            <UsersIcon size={48} strokeWidth={1} />
            <p>Channels directory coming soon</p>
          </div>
        )}

        {activeTab === 'usergroups' && (
          <div className="directories-placeholder">
            <UsersIcon size={48} strokeWidth={1} />
            <p>User Groups directory coming soon</p>
          </div>
        )}

        {activeTab === 'external' && (
          <div className="directories-placeholder">
            <UsersIcon size={48} strokeWidth={1} />
            <p>External connections directory coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoriesPanel;
