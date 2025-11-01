import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Plus,
  Smile,
  AtSign,
  Video,
  Mic,
  Command,
  Send,
  ChevronDown
} from 'lucide-react';
import { useChannelStateContext, useChannelActionContext } from 'stream-chat-react';
import '../styles/slack-message-input.css';

const SlackMessageInput = () => {
  const [messageText, setMessageText] = useState('');
  const [isFormattingVisible, setIsFormattingVisible] = useState(true);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  // Get channel from context
  const { channel } = useChannelStateContext();
  const { sendMessage } = useChannelActionContext();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);

  const handleSendMessage = async () => {
    try {
      if (messageText.trim() && channel) {
        // Send message using the channel directly
        await channel.sendMessage({
          text: messageText,
        });

        // Clear input after successful send
        setMessageText('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // You could add a toast notification here for better UX
    }
  };

  const handleKeyDown = (e) => {
    try {
      // Send on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    } catch (error) {
      console.error('Error in handleKeyDown:', error);
    }
  };

  const toggleFormat = (format) => {
    try {
      setActiveFormats(prev => {
        const newFormats = new Set(prev);
        if (newFormats.has(format)) {
          newFormats.delete(format);
        } else {
          newFormats.add(format);
        }
        return newFormats;
      });
    } catch (error) {
      console.error('Error toggling format:', error);
    }
  };

  const handleVideoCall = () => {
    try {
      if (channel) {
        // Create a call ID based on channel ID
        const callId = `call-${channel.id}-${Date.now()}`;
        navigate(`/call/${callId}`);
      }
    } catch (error) {
      console.error('Error starting video call:', error);
    }
  };

  const FormatButton = ({ format, icon: Icon, label, dataQa }) => {
    try {
      return (
        <button
          className={`slack-composer__button ${activeFormats.has(format) ? 'slack-composer__button--active' : ''}`}
          onClick={() => toggleFormat(format)}
          aria-label={label}
          aria-pressed={activeFormats.has(format)}
          data-qa={dataQa}
          type="button"
        >
          <Icon size={18} strokeWidth={1.5} />
        </button>
      );
    } catch (error) {
      console.error('Error rendering FormatButton:', error);
      return null;
    }
  };

  const ActionButton = ({ icon: Icon, label, onClick, dataQa, size = 18 }) => {
    try {
      return (
        <button
          className="slack-action-button"
          onClick={onClick}
          aria-label={label}
          data-qa={dataQa}
          type="button"
        >
          <Icon size={size} strokeWidth={1.5} />
        </button>
      );
    } catch (error) {
      console.error('Error rendering ActionButton:', error);
      return null;
    }
  };

  const CodeBlockIcon = () => (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M9.212 2.737a.75.75 0 1 0-1.424-.474l-2.5 7.5a.75.75 0 0 0 1.424.474zm6.038.265a.75.75 0 0 0 0 1.5h2a.25.25 0 0 1 .25.25v11.5a.25.25 0 0 1-.25.25h-13a.25.25 0 0 1-.25-.25v-3.5a.75.75 0 0 0-1.5 0v3.5c0 .966.784 1.75 1.75 1.75h13a1.75 1.75 0 0 0 1.75-1.75v-11.5a1.75 1.75 0 0 0-1.75-1.75zm-3.69.5a.75.75 0 1 0-1.12.996l1.556 1.754-1.556 1.75a.75.75 0 1 0 1.12.997l2-2.249a.75.75 0 0 0 0-.996zM3.999 9.061a.75.75 0 0 1-1.058-.062l-2-2.249a.75.75 0 0 1 0-.996l2-2.252a.75.75 0 1 1 1.12.996L2.504 6.252l1.557 1.75a.75.75 0 0 1-.062 1.059"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );

  const FormattingIcon = () => (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M6.941 3.952c-.459-1.378-2.414-1.363-2.853.022l-4.053 12.8a.75.75 0 0 0 1.43.452l1.101-3.476h6.06l1.163 3.487a.75.75 0 1 0 1.423-.474zm1.185 8.298L5.518 4.427 3.041 12.25zm6.198-5.537a4.74 4.74 0 0 1 3.037-.081A3.74 3.74 0 0 1 20 10.208V17a.75.75 0 0 1-1.5 0v-.745a8 8 0 0 1-2.847 1.355 3 3 0 0 1-3.15-1.143C10.848 14.192 12.473 11 15.287 11H18.5v-.792c0-.984-.641-1.853-1.581-2.143a3.24 3.24 0 0 0-2.077.056l-.242.089a2.22 2.22 0 0 0-1.34 1.382l-.048.145a.75.75 0 0 1-1.423-.474l.048-.145a3.72 3.72 0 0 1 2.244-2.315zM18.5 12.5h-3.213c-1.587 0-2.504 1.801-1.57 3.085.357.491.98.717 1.572.57a6.5 6.5 0 0 0 2.47-1.223l.741-.593z"
        clipRule="evenodd"
      />
    </svg>
  );

  const SlashIcon = () => (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4.5 3h11A1.5 1.5 0 0 1 17 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-11A1.5 1.5 0 0 1 4.5 3m-3 1.5a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3zm11.64 1.391a.75.75 0 0 0-1.28-.782l-5.5 9a.75.75 0 0 0 1.28.782z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="slack-message-input" data-qa="message_input_container">
      <div className="slack-message-input__inner">
        <div className={`slack-message-input__container ${isFocused ? 'slack-message-input__container--focused' : ''}`}>

          {/* Formatting Toolbar - Top */}
          {isFormattingVisible && (
            <div
              className={`slack-formatting-toolbar ${isFocused ? 'slack-formatting-toolbar--focused' : ''}`}
              role="toolbar"
              aria-label="Formatting"
              aria-orientation="horizontal"
            >
              <FormatButton format="bold" icon={Bold} label="Bold" dataQa="bold-composer-button" />
              <FormatButton format="italic" icon={Italic} label="Italic" dataQa="italic-composer-button" />
              <FormatButton format="underline" icon={Underline} label="Underline" dataQa="underline-composer-button" />
              <FormatButton format="strikethrough" icon={Strikethrough} label="Strikethrough" dataQa="strike-composer-button" />

              <span className="slack-composer__separator"></span>

              <FormatButton format="link" icon={LinkIcon} label="Link" dataQa="link-composer-button" />
              <FormatButton format="ordered-list" icon={ListOrdered} label="Ordered list" dataQa="ordered-list-composer-button" />
              <FormatButton format="bullet-list" icon={List} label="Bulleted list" dataQa="bullet-list-composer-button" />

              <span className="slack-composer__separator"></span>

              <FormatButton format="blockquote" icon={Quote} label="Blockquote" dataQa="blockquote-composer-button" />
              <FormatButton format="code" icon={Code} label="Code" dataQa="code-composer-button" />

              <button
                className="slack-composer__button"
                onClick={() => toggleFormat('code-block')}
                aria-label="Code block"
                aria-pressed={activeFormats.has('code-block')}
                data-qa="code-block-composer-button"
                type="button"
              >
                <CodeBlockIcon />
              </button>
            </div>
          )}

          {/* Text Input Area */}
          <div className="slack-text-input__container">
            <textarea
              ref={textareaRef}
              className="slack-text-input"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Jot something down"
              aria-label="Message input"
              rows={1}
            />
          </div>

          {/* Action Toolbar - Bottom */}
          <div
            className="slack-action-toolbar"
            role="toolbar"
            aria-label="Composer actions"
            aria-orientation="horizontal"
          >
            {/* Left-aligned actions */}
            <div className="slack-action-toolbar__prefix">
              <ActionButton icon={Plus} label="Attach" dataQa="shortcuts_menu_trigger" />
            </div>

            {/* Center actions */}
            <div className="slack-action-toolbar__buttons">
              <button
                className={`slack-action-button slack-action-button--formatting ${isFormattingVisible ? 'slack-action-button--active' : ''}`}
                onClick={() => setIsFormattingVisible(!isFormattingVisible)}
                aria-label={isFormattingVisible ? "Hide formatting" : "Show formatting"}
                aria-pressed={isFormattingVisible}
                data-qa="texty_composer_button"
                type="button"
              >
                <FormattingIcon />
              </button>
              <ActionButton icon={Smile} label="Emoji" dataQa="emoji_toolbar_button" />
              <ActionButton icon={AtSign} label="Mention someone" dataQa="texty_mention_button" />

              <span className="slack-action-toolbar__divider"></span>

              <ActionButton icon={Video} label="Start video call" dataQa="video_composer_button" onClick={handleVideoCall} />
              <ActionButton icon={Mic} label="Record audio clip" dataQa="audio_composer_button" />

              <span className="slack-action-toolbar__divider"></span>

              <button
                className="slack-action-button"
                aria-label="Run shortcut"
                data-qa="slash_commands_composer_button"
                type="button"
              >
                <SlashIcon />
              </button>
            </div>

            {/* Right-aligned send button */}
            <div className="slack-action-toolbar__suffix">
              <span className="slack-send-button-group">
                <button
                  className={`slack-send-button ${!messageText.trim() ? 'slack-send-button--disabled' : ''}`}
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  aria-label="Send now"
                  aria-disabled={!messageText.trim()}
                  data-qa="texty_send_button"
                  type="button"
                >
                  <Send size={16} fill={messageText.trim() ? 'currentColor' : 'none'} />
                </button>
                <button
                  className={`slack-send-options-button ${!messageText.trim() ? 'slack-send-button--disabled' : ''}`}
                  disabled={!messageText.trim()}
                  aria-label="Schedule for later"
                  aria-disabled={!messageText.trim()}
                  data-qa="texty_send_options_button"
                  type="button"
                >
                  <ChevronDown size={12} />
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlackMessageInput;