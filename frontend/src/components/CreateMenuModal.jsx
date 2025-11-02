import { useEffect, useRef } from 'react';
import { MessageSquare, Hash, Video, FileText, List, Zap, UserPlus } from 'lucide-react';
import '../styles/create-menu-modal.css';

const CreateMenuModal = ({ isOpen, onClose, buttonRef, onActionSelect }) => {
  const modalRef = useRef(null);
  const firstItemRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus first item when modal opens
    if (firstItemRef.current) {
      firstItemRef.current.focus();
    }

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'message',
      icon: MessageSquare,
      title: 'Message',
      description: 'Send a message to anyone',
      shortcut: 'N',
    },
    {
      id: 'channel',
      icon: Hash,
      title: 'Channel',
      description: 'Organize conversations by topic',
    },
    {
      id: 'huddle',
      icon: Video,
      title: 'Huddle',
      description: 'Start an audio conversation',
      shortcut: 'H',
    },
    {
      id: 'canvas',
      icon: FileText,
      title: 'Canvas',
      description: 'Create and share content',
      shortcut: 'C',
    },
    {
      id: 'list',
      icon: List,
      title: 'List',
      description: 'Track tasks and projects',
    },
    {
      id: 'workflow',
      icon: Zap,
      title: 'Workflow',
      description: 'Automate tasks',
    },
  ];

  const handleItemClick = (itemId) => {
    // Close the create menu
    onClose();

    // Notify parent component about the action
    if (onActionSelect) {
      onActionSelect(itemId);
    }
  };

  const handleKeyDown = (e, itemId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(itemId);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="create-menu-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="create-menu-modal" role="menu" aria-label="Create menu">
        <div className="create-menu__scroller">
          <div className="create-menu__items">
            {/* Header */}
            <div className="create-menu__header">
              Create
            </div>

            {/* Menu Items */}
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="create-menu__item-wrapper">
                  <button
                    ref={index === 0 ? firstItemRef : null}
                    className="create-menu__item"
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => handleItemClick(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    aria-labelledby={`${item.id}-label`}
                    aria-describedby={`${item.id}-description`}
                  >
                    <div className="create-menu__item-content">
                      {/* Icon */}
                      <div className={`create-menu__item-icon create-menu__item-icon--${item.id}`}>
                        <Icon className="icon" />
                      </div>

                      {/* Label */}
                      <div className="create-menu__item-label">
                        <div id={`${item.id}-label`} className="create-menu__item-title">
                          {item.title}
                        </div>
                        <div id={`${item.id}-description`} className="create-menu__item-description">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {/* Shortcut (if exists) */}
                    {item.shortcut && (
                      <div className="create-menu__item-shortcut">
                        <kbd className="shortcut-key">⌘</kbd>
                        <kbd className="shortcut-key">{item.shortcut}</kbd>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}

            {/* Separator */}
            <div className="create-menu__separator">
              <div className="separator-line" />
            </div>

            {/* Invite People */}
            <div className="create-menu__item-wrapper">
              <button
                className="create-menu__item create-menu__item--invite"
                role="menuitem"
                tabIndex={0}
                onClick={() => handleItemClick('invite')}
                onKeyDown={(e) => handleKeyDown(e, 'invite')}
                aria-labelledby="invite-label"
              >
                <div className="create-menu__item-content">
                  {/* Icon */}
                  <div className="create-menu__item-icon create-menu__item-icon--invite">
                    <UserPlus className="icon" />
                  </div>

                  {/* Label */}
                  <div className="create-menu__item-label">
                    <div id="invite-label" className="create-menu__item-title">
                      Invite people
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateMenuModal;
