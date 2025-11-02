import { useEffect, useRef } from 'react';
import { Wrench } from 'lucide-react';
import '../styles/more-menu.css';

const MoreMenuModal = ({ isOpen, onClose, buttonRef }) => {
  const menuRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef?.current &&
        !buttonRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, buttonRef]);

  // Handle Tools click
  const handleToolsClick = () => {
    alert('Tools: Create and find workflows and apps');
    onClose();
  };

  // Handle Customize navigation bar click
  const handleCustomizeClick = () => {
    alert('Customize navigation bar feature coming soon!');
    onClose();
  };

  if (!isOpen) return null;

  // Calculate position relative to button
  const getPosition = () => {
    if (!buttonRef?.current) return { top: '50%', left: '100%' };

    const buttonRect = buttonRef.current.getBoundingClientRect();
    return {
      top: `${buttonRect.top}px`,
      left: `${buttonRect.right + 12}px`,
    };
  };

  const position = getPosition();

  return (
    <div
      ref={menuRef}
      className="more-menu-modal"
      style={position}
      role="menu"
      aria-label="More"
    >
      {/* Header */}
      <div className="more-menu__header">
        More
      </div>

      {/* Tools Menu Item */}
      <button
        className="more-menu__item"
        onClick={handleToolsClick}
        role="menuitem"
        aria-label="Tools"
      >
        <div className="more-menu__item-icon">
          <Wrench size={20} />
        </div>
        <div className="more-menu__item-content">
          <div className="more-menu__item-title">Tools</div>
          <div className="more-menu__item-subtitle">
            Create and find workflows and apps
          </div>
        </div>
      </button>

      {/* Customize Navigation Bar Link */}
      <button
        className="more-menu__link"
        onClick={handleCustomizeClick}
        role="menuitem"
      >
        Customize navigation bar
      </button>
    </div>
  );
};

export default MoreMenuModal;
