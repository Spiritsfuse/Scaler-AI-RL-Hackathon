import { useState, useEffect } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { listAPI } from '../lib/api';
import '../styles/add-list-modal.css';

const AddListModal = ({ isOpen, onClose, channelId, channelName, onListCreated }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLists();
    }
  }, [isOpen, activeTab, channelId]);

  const fetchLists = async () => {
    try {
      setIsLoading(true);
      const filter = activeTab === 'all' ? 'all' : 
                    activeTab === 'shared' ? 'shared' : 'created';
      const response = await listAPI.getLists(filter, channelId);
      if (response.success) {
        setLists(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedList(null);
    setShowCreateModal(false);
    onClose();
  };

  const handleInsert = () => {
    if (selectedList && onListCreated) {
      onListCreated(selectedList);
    }
    handleClose();
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedLists = [...filteredLists].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div className="add-list-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="add-list-modal__header">
            <h2 className="add-list-modal__title">Add a list</h2>
            <button
              className="add-list-modal__close"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="add-list-modal__search">
            <Search className="add-list-search-icon" size={18} />
            <input
              type="text"
              className="add-list-search-input"
              placeholder="Search by list name or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Tabs and Sort */}
          <div className="add-list-modal__controls">
            <div className="add-list-tabs">
              <button
                className={`add-list-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All lists
              </button>
              <button
                className={`add-list-tab ${activeTab === 'shared' ? 'active' : ''}`}
                onClick={() => setActiveTab('shared')}
              >
                Shared with you
              </button>
              <button
                className={`add-list-tab ${activeTab === 'created' ? 'active' : ''}`}
                onClick={() => setActiveTab('created')}
              >
                Created by you
              </button>
            </div>
            <select
              className="add-list-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Recently viewed</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>

          {/* Lists */}
          <div className="add-list-modal__content">
            {isLoading ? (
              <div className="add-list-loading">Loading lists...</div>
            ) : sortedLists.length === 0 ? (
              <div className="add-list-empty">
                <p>No lists found</p>
                <p className="add-list-empty-hint">
                  {searchQuery ? 'Try a different search term' : 'Create a new list to get started'}
                </p>
              </div>
            ) : (
              <div className="add-list-items">
                {sortedLists.map((list) => (
                  <button
                    key={list._id}
                    className={`add-list-item ${selectedList?._id === list._id ? 'selected' : ''}`}
                    onClick={() => setSelectedList(list)}
                  >
                    <div className="add-list-item__icon" style={{ backgroundColor: list.color }}>
                      📋
                    </div>
                    <div className="add-list-item__info">
                      <h3 className="add-list-item__name">{list.name}</h3>
                      <p className="add-list-item__meta">
                        {list.items.length} items • {list.channelName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="add-list-modal__footer">
            <button
              className="add-list-btn add-list-btn--secondary"
              onClick={handleCreateNew}
            >
              <Plus size={16} />
              Create New List
            </button>
            <div className="add-list-actions">
              <button
                className="add-list-btn add-list-btn--ghost"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="add-list-btn add-list-btn--primary"
                onClick={handleInsert}
                disabled={!selectedList}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <CreateListModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          channelId={channelId}
          channelName={channelName}
          onListCreated={(newList) => {
            setLists([newList, ...lists]);
            setSelectedList(newList);
            setShowCreateModal(false);
          }}
        />
      )}
    </>
  );
};

// Create List Modal Component
const CreateListModal = ({ isOpen, onClose, channelId, channelName, onListCreated }) => {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#1264a3');
  const [isCreating, setIsCreating] = useState(false);

  const colors = [
    '#1264a3', '#4f46e5', '#7c3aed', '#dc2626', 
    '#ea580c', '#ca8a04', '#16a34a', '#0891b2'
  ];

  const handleCreate = async () => {
    if (!listName.trim()) return;

    try {
      setIsCreating(true);
      const response = await listAPI.createList({
        name: listName.trim(),
        description: description.trim(),
        channelId,
        channelName,
        color
      });

      if (response.success) {
        onListCreated(response.data);
        setListName('');
        setDescription('');
        setColor('#1264a3');
      }
    } catch (error) {
      console.error('Error creating list:', error);
      alert('Failed to create list. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-list-modal__header">
          <h2 className="create-list-modal__title">Create New List</h2>
          <button className="create-list-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="create-list-modal__body">
          <div className="create-list-field">
            <label className="create-list-label">List name *</label>
            <input
              type="text"
              className="create-list-input"
              placeholder="e.g., Project Tasks"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="create-list-field">
            <label className="create-list-label">Description (optional)</label>
            <textarea
              className="create-list-textarea"
              placeholder="What's this list for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="create-list-field">
            <label className="create-list-label">Color</label>
            <div className="create-list-colors">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`create-list-color ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="create-list-info">
            📍 This list will be added to <strong>#{channelName}</strong>
          </div>
        </div>

        <div className="create-list-modal__footer">
          <button
            className="create-list-btn create-list-btn--ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="create-list-btn create-list-btn--primary"
            onClick={handleCreate}
            disabled={!listName.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create List'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddListModal;
