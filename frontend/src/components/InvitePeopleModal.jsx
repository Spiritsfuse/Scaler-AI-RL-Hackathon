import { useState } from 'react';
import { X, Mail, Copy, Check } from 'lucide-react';
import '../styles/invite-people-modal.css';

const InvitePeopleModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate a sample invite link (in production, this would come from the backend)
  const inviteLink = `${window.location.origin}/invite/workspace-token-${Date.now()}`;

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (email.trim() && isValidEmail(email)) {
      if (!emails.includes(email.toLowerCase())) {
        setEmails([...emails, email.toLowerCase()]);
        setEmail('');
      }
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSendInvites = async () => {
    if (emails.length === 0) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Sending invites to:', emails);
      alert(`Invitations sent to ${emails.length} people!`);
      setEmails([]);
      onClose();
    } catch (error) {
      console.error('Error sending invites:', error);
      alert('Failed to send invitations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      handleAddEmail(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invite-people-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="invite-modal__header">
          <h2 className="modal-title">Invite people to workspace</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="invite-modal__body">
          {/* Email Input */}
          <div className="invite-section">
            <label className="invite-label">
              <Mail size={16} />
              <span>Email addresses</span>
            </label>
            <form onSubmit={handleAddEmail} className="email-input-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="name@example.com"
                className="email-input"
                autoFocus
              />
              <button
                type="submit"
                className="add-email-btn"
                disabled={!email.trim() || !isValidEmail(email)}
              >
                Add
              </button>
            </form>

            {/* Email Tags */}
            {emails.length > 0 && (
              <div className="email-tags">
                {emails.map((em, index) => (
                  <div key={index} className="email-tag">
                    <span>{em}</span>
                    <button
                      onClick={() => handleRemoveEmail(em)}
                      className="remove-email-btn"
                      aria-label={`Remove ${em}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="invite-divider">
            <span className="divider-text">Or</span>
          </div>

          {/* Invite Link */}
          <div className="invite-section">
            <label className="invite-label">
              <span>Share invite link</span>
            </label>
            <div className="invite-link-container">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="invite-link-input"
              />
              <button
                onClick={handleCopyLink}
                className="copy-link-btn"
                aria-label="Copy link"
              >
                {isCopied ? (
                  <>
                    <Check size={16} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="invite-hint">
              Anyone with this link can join your workspace
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="invite-modal__footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSendInvites}
            disabled={emails.length === 0 || isLoading}
          >
            {isLoading ? 'Sending...' : `Send ${emails.length > 0 ? `${emails.length} ` : ''}Invitations`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitePeopleModal;
