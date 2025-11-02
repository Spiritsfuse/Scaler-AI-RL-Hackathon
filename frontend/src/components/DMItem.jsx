const DMItem = ({ name, message, time, unreadCount, avatar, onClick, isActive }) => {
  return (
    <div
      onClick={onClick}
      className={`dm-item ${isActive ? 'active' : ''}`}
    >
      <div className="dm-item__content">
        {/* Avatar */}
        <div className="dm-item__avatar">
          {avatar ? (
            <img src={avatar} alt={name} className="dm-item__avatar-img" />
          ) : (
            <span className="dm-item__avatar-text">{name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* Name and Message */}
        <div className="dm-item__info">
          <div className="dm-item__header">
            <p className="dm-item__name">{name}</p>
            <span className="dm-item__time">{time}</span>
          </div>
          <p className="dm-item__message">{message}</p>
        </div>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="dm-item__badge">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default DMItem;
