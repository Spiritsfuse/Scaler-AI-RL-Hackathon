import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import '../styles/channel-options-menu.css';

const ChannelOptionsMenu = ({ onCreateChannel, onClose, buttonRef }) => {
  const menuRef = useRef(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('alphabetically');
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    try {
      // Calculate menu position based on button position
      if (buttonRef && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: buttonRect.bottom + 4,
          left: buttonRect.right + 8
        });
      }
    } catch (error) {
      console.error('Error calculating menu position:', error);
    }
  }, [buttonRef]);

  useEffect(() => {
    try {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          if (onClose) onClose();
        }
      };

      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          if (activeSubmenu) {
            setActiveSubmenu(null);
          } else if (onClose) {
            onClose();
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    } catch (error) {
      console.error('Error setting up menu event listeners:', error);
    }
  }, [onClose, activeSubmenu]);

  const handleCreateChannelClick = () => {
    try {
      if (onCreateChannel) {
        onCreateChannel();
      }
      if (onClose) onClose();
    } catch (error) {
      console.error('Error handling create channel:', error);
    }
  };

  const handleCreateSectionClick = () => {
    try {
      // TODO: Implement create section functionality
      console.log('Create section clicked');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error handling create section:', error);
    }
  };

  const handleBrowseChannelsClick = () => {
    try {
      // TODO: Implement browse channels functionality
      console.log('Browse channels clicked');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error handling browse channels:', error);
    }
  };

  const handleEditAllSectionsClick = () => {
    try {
      // TODO: Implement edit all sections functionality
      console.log('Edit all sections clicked');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error handling edit all sections:', error);
    }
  };

  const handleLeaveInactiveClick = () => {
    try {
      // TODO: Implement leave inactive channels functionality
      console.log('Leave inactive channels clicked');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error handling leave inactive channels:', error);
    }
  };

  const handleFilterChange = (filter) => {
    try {
      setSelectedFilter(filter);
      console.log('Filter changed to:', filter);
      // TODO: Implement filter logic
    } catch (error) {
      console.error('Error handling filter change:', error);
    }
  };

  const handleSortChange = (sort) => {
    try {
      setSelectedSort(sort);
      console.log('Sort changed to:', sort);
      // TODO: Implement sort logic
      if (onClose) onClose();
    } catch (error) {
      console.error('Error handling sort change:', error);
    }
  };

  const handleSubmenuEnter = (submenuName) => {
    try {
      // Clear any pending close timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setActiveSubmenu(submenuName);
    } catch (error) {
      console.error('Error handling submenu enter:', error);
    }
  };

  const handleSubmenuLeave = () => {
    try {
      // Add a small delay before closing to allow mouse to move to submenu
      closeTimeoutRef.current = setTimeout(() => {
        setActiveSubmenu(null);
      }, 1000);
    } catch (error) {
      console.error('Error handling submenu leave:', error);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="channel-options-menu" 
      ref={menuRef}
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`
      }}
    >
      <div className="channel-options-menu__content">
        {/* Create Option with Submenu */}
        <div 
          className="channel-options-menu__item-wrapper"
          onMouseEnter={() => handleSubmenuEnter('create')}
          onMouseLeave={handleSubmenuLeave}
        >
          <button className="channel-options-menu__item">
            <span className="channel-options-menu__item-text">Create</span>
            <ChevronRight className="channel-options-menu__item-chevron" />
          </button>
          
          {activeSubmenu === 'create' && (
            <div 
              className="channel-options-submenu"
              onMouseEnter={() => handleSubmenuEnter('create')}
              onMouseLeave={handleSubmenuLeave}
            >
              <button 
                className="channel-options-menu__item"
                onClick={handleCreateChannelClick}
              >
                <span className="channel-options-menu__item-text">Create channel</span>
              </button>
              <button 
                className="channel-options-menu__item"
                onClick={handleCreateSectionClick}
              >
                <span className="channel-options-menu__item-text">Create section</span>
              </button>
            </div>
          )}
        </div>

        {/* Manage Option with Submenu */}
        <div 
          className="channel-options-menu__item-wrapper"
          onMouseEnter={() => handleSubmenuEnter('manage')}
          onMouseLeave={handleSubmenuLeave}
        >
          <button className="channel-options-menu__item">
            <span className="channel-options-menu__item-text">Manage</span>
            <ChevronRight className="channel-options-menu__item-chevron" />
          </button>
          
          {activeSubmenu === 'manage' && (
            <div 
              className="channel-options-submenu"
              onMouseEnter={() => handleSubmenuEnter('manage')}
              onMouseLeave={handleSubmenuLeave}
            >
              <button 
                className="channel-options-menu__item"
                onClick={handleBrowseChannelsClick}
              >
                <span className="channel-options-menu__item-text">Browse channels</span>
              </button>
              <button 
                className="channel-options-menu__item"
                onClick={handleEditAllSectionsClick}
              >
                <span className="channel-options-menu__item-text">Edit all sections</span>
              </button>
              <button 
                className="channel-options-menu__item"
                onClick={handleLeaveInactiveClick}
              >
                <span className="channel-options-menu__item-text">Leave inactive channels</span>
              </button>
            </div>
          )}
        </div>

        <div className="channel-options-menu__divider" />

        {/* Show and sort Option with Submenu */}
        <div 
          className="channel-options-menu__item-wrapper"
          onMouseEnter={() => handleSubmenuEnter('showsort')}
          onMouseLeave={handleSubmenuLeave}
        >
          <button className="channel-options-menu__item">
            <span className="channel-options-menu__item-text">Show and sort</span>
            <span className="channel-options-menu__item-badge">All</span>
            <ChevronRight className="channel-options-menu__item-chevron" />
          </button>
          
          {activeSubmenu === 'showsort' && (
            <div 
              className="channel-options-submenu channel-options-submenu--wide"
              onMouseEnter={() => handleSubmenuEnter('showsort')}
              onMouseLeave={handleSubmenuLeave}
            >
              {/* Show in this section */}
              <div className="channel-options-submenu__section">
                <div className="channel-options-submenu__label">Show in this section</div>
                
                <button 
                  className="channel-options-menu__item channel-options-menu__item--with-check"
                  onClick={() => handleFilterChange('all')}
                >
                  {selectedFilter === 'all' && <Check className="channel-options-menu__item-check" />}
                  <span className="channel-options-menu__item-text">All</span>
                </button>
                
                <button 
                  className="channel-options-menu__item channel-options-menu__item--with-check"
                  onClick={() => handleFilterChange('unreads')}
                >
                  {selectedFilter === 'unreads' && <Check className="channel-options-menu__item-check" />}
                  <span className="channel-options-menu__item-text">Unreads only</span>
                </button>
                
                <button 
                  className="channel-options-menu__item channel-options-menu__item--with-check"
                  onClick={() => handleFilterChange('mentions')}
                >
                  {selectedFilter === 'mentions' && <Check className="channel-options-menu__item-check" />}
                  <span className="channel-options-menu__item-text">Mentions only</span>
                </button>
              </div>

              <div className="channel-options-menu__divider" />

              {/* Sort this section */}
              <div className="channel-options-submenu__section">
                <div className="channel-options-submenu__label">Sort this section</div>
                
                <button 
                  className="channel-options-menu__item channel-options-menu__item--with-check"
                  onClick={() => handleSortChange('alphabetically')}
                >
                  {selectedSort === 'alphabetically' && <Check className="channel-options-menu__item-check" />}
                  <span className="channel-options-menu__item-text">Alphabetically</span>
                </button>
                
                <button 
                  className="channel-options-menu__item channel-options-menu__item--with-check"
                  onClick={() => handleSortChange('recent')}
                >
                  {selectedSort === 'recent' && <Check className="channel-options-menu__item-check" />}
                  <span className="channel-options-menu__item-text">By most recent</span>
                </button>
                
                <button 
                  className="channel-options-menu__item channel-options-menu__item--with-check"
                  onClick={() => handleSortChange('priority')}
                >
                  {selectedSort === 'priority' && <Check className="channel-options-menu__item-check" />}
                  <span className="channel-options-menu__item-text">Priority</span>
                </button>
              </div>

              <div className="channel-options-menu__divider" />

              {/* Link to preferences */}
              <button className="channel-options-menu__item channel-options-menu__item--link">
                <span className="channel-options-menu__item-text">Change these settings for all sections in Preferences</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelOptionsMenu;
