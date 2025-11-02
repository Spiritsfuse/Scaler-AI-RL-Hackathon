import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';
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
  Paperclip,
  Send,
  ChevronDown,
  FileText,
  BarChart3,
  Upload,
  X
} from 'lucide-react';
import { useChannelStateContext, useChannelActionContext } from 'stream-chat-react';
import '../styles/slack-message-input.css';

// Utility function to convert HTML to Markdown
const htmlToMarkdown = (html) => {
  try {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Recursive function to process nodes
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const children = Array.from(node.childNodes).map(processNode).join('');

        switch (tagName) {
          case 'strong':
          case 'b':
            return `**${children}**`;
          case 'em':
          case 'i':
            return `*${children}*`;
          case 'u':
            return `__${children}__`;
          case 'del':
          case 's':
          case 'strike':
            return `~~${children}~~`;
          case 'code':
            return `\`${children}\``;
          case 'pre':
            return `\n\`\`\`\n${children}\n\`\`\`\n`;
          case 'blockquote':
            return children.split('\n').map(line => `> ${line}`).join('\n');
          case 'a':
            const href = node.getAttribute('href') || '';
            return `[${children}](${href})`;
          case 'ul':
            return '\n' + children;
          case 'ol':
            return '\n' + children;
          case 'li':
            const parent = node.parentElement;
            if (parent?.tagName.toLowerCase() === 'ol') {
              const index = Array.from(parent.children).indexOf(node) + 1;
              return `${index}. ${children}\n`;
            }
            return `- ${children}\n`;
          case 'br':
            return '\n';
          case 'div':
          case 'p':
            return children + '\n';
          default:
            return children;
        }
      }

      return '';
    };

    const markdown = processNode(tempDiv).trim();
    return markdown;
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error);
    return html;
  }
};

const SlackMessageInput = () => {
  const [messageText, setMessageText] = useState('');
  const [isFormattingVisible, setIsFormattingVisible] = useState(true);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [isFocused, setIsFocused] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const plusButtonRef = useRef(null);
  const navigate = useNavigate();

  // Get channel and user from context
  const { channel } = useChannelStateContext();
  const { sendMessage } = useChannelActionContext();
  const { user } = useUser();

  // Generate dynamic placeholder text
  const getPlaceholderText = () => {
    try {
      if (!channel) return 'Message';

      // Check if it's a DM
      const isDM = channel.data?.member_count === 2 && channel.data?.id.includes('user_');

      if (isDM) {
        // For DMs, show the other user's name
        const members = channel.state?.members ? Object.values(channel.state.members) : [];
        const otherUser = members.find(member => member.user.id !== user?.id);
        if (otherUser) {
          return `Message @${otherUser.user.name || otherUser.user.id}`;
        }
        return 'Message';
      } else {
        // For channels, show channel name with #
        const channelName = channel.data?.id || 'general';
        return `Message #${channelName}`;
      }
    } catch (error) {
      console.error('Error generating placeholder:', error);
      return 'Message';
    }
  };

  // Update messageText state when editor content changes
  const handleInput = useCallback(() => {
    try {
      if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        // For empty div, clear the state
        if (html === '<br>' || html === '<div><br></div>' || !editorRef.current.textContent?.trim()) {
          setMessageText('');
        } else {
          setMessageText(html);
        }
      }
    } catch (error) {
      console.error('Error handling input:', error);
    }
  }, []);


  const handleSendMessage = async () => {
    try {
      if (!editorRef.current || !channel) return;

      const textContent = editorRef.current.textContent?.trim();
      if (!textContent) return;

      // Convert HTML to Markdown
      const html = editorRef.current.innerHTML;
      const markdown = htmlToMarkdown(html);

      // Send message using the channel directly
      await channel.sendMessage({
        text: markdown,
      });

      // Clear input after successful send
      setMessageText('');
      editorRef.current.innerHTML = '';
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

  // Helper function to apply visual formatting using document.execCommand
  const applyFormatting = (formatType) => {
    try {
      const editor = editorRef.current;
      if (!editor) return;

      // Focus the editor first
      editor.focus();

      // Save current selection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      switch (formatType) {
        case 'bold':
          document.execCommand('bold', false, null);
          break;

        case 'italic':
          document.execCommand('italic', false, null);
          break;

        case 'underline':
          document.execCommand('underline', false, null);
          break;

        case 'strikethrough':
          document.execCommand('strikeThrough', false, null);
          break;

        case 'code':
          // Wrap selection in <code> tag
          const selectedText = selection.toString();
          if (selectedText) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const codeElement = document.createElement('code');
            codeElement.textContent = selectedText;
            codeElement.style.backgroundColor = '#f4f4f4';
            codeElement.style.padding = '2px 4px';
            codeElement.style.borderRadius = '3px';
            codeElement.style.fontFamily = 'monospace';
            range.insertNode(codeElement);
            // Move cursor after the code element
            range.setStartAfter(codeElement);
            range.setEndAfter(codeElement);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            // Insert empty code tag
            const codeElement = document.createElement('code');
            codeElement.textContent = '\u200B'; // Zero-width space
            codeElement.style.backgroundColor = '#f4f4f4';
            codeElement.style.padding = '2px 4px';
            codeElement.style.borderRadius = '3px';
            codeElement.style.fontFamily = 'monospace';
            const range = selection.getRangeAt(0);
            range.insertNode(codeElement);
            range.setStart(codeElement.firstChild, 0);
            range.setEnd(codeElement.firstChild, 1);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          break;

        case 'code-block':
          // Insert a pre/code block
          const preElement = document.createElement('pre');
          const codeBlock = document.createElement('code');
          codeBlock.style.display = 'block';
          codeBlock.style.backgroundColor = '#f4f4f4';
          codeBlock.style.padding = '10px';
          codeBlock.style.borderRadius = '5px';
          codeBlock.style.fontFamily = 'monospace';
          codeBlock.style.whiteSpace = 'pre-wrap';

          const selectedCodeText = selection.toString();
          codeBlock.textContent = selectedCodeText || '\u200B';
          preElement.appendChild(codeBlock);

          const codeRange = selection.getRangeAt(0);
          codeRange.deleteContents();
          codeRange.insertNode(preElement);

          // Place cursor inside
          codeRange.setStart(codeBlock.firstChild, selectedCodeText ? selectedCodeText.length : 0);
          codeRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(codeRange);
          break;

        case 'blockquote':
          // Use formatBlock for blockquote
          document.execCommand('formatBlock', false, '<blockquote>');
          // Style the blockquote
          const blockquotes = editor.querySelectorAll('blockquote');
          blockquotes.forEach(bq => {
            bq.style.borderLeft = '4px solid #ccc';
            bq.style.paddingLeft = '10px';
            bq.style.marginLeft = '0';
            bq.style.color = '#666';
          });
          break;

        case 'ordered-list':
          document.execCommand('insertOrderedList', false, null);
          break;

        case 'bullet-list':
          document.execCommand('insertUnorderedList', false, null);
          break;

        case 'link':
          const url = prompt('Enter the URL:');
          if (url) {
            document.execCommand('createLink', false, url);
          }
          break;

        default:
          return;
      }

      // Update the message text state
      handleInput();

    } catch (error) {
      console.error('Error applying formatting:', error);
    }
  };

  const toggleFormat = (format) => {
    try {
      // Apply the formatting
      applyFormatting(format);

      // Toggle the active state for visual feedback
      setActiveFormats(prev => {
        const newFormats = new Set(prev);
        if (newFormats.has(format)) {
          newFormats.delete(format);
        } else {
          newFormats.add(format);
        }
        return newFormats;
      });

      // Remove active state after a short delay (visual feedback)
      setTimeout(() => {
        setActiveFormats(prev => {
          const newFormats = new Set(prev);
          newFormats.delete(format);
          return newFormats;
        });
      }, 300);
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

  // Close plus menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        plusButtonRef.current &&
        !plusButtonRef.current.contains(event.target) &&
        showPlusMenu
      ) {
        setShowPlusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPlusMenu]);

  const handlePlusClick = () => {
    try {
      setShowPlusMenu(!showPlusMenu);
    } catch (error) {
      console.error('Error toggling plus menu:', error);
    }
  };

  const handleFileSelect = () => {
    try {
      setShowPlusMenu(false);
      fileInputRef.current?.click();
    } catch (error) {
      console.error('Error opening file selector:', error);
    }
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !channel) return;

      setIsUploading(true);

      // Check if it's an image or other file
      const isImage = file.type.startsWith('image/');

      // Upload file to Stream CDN and send as message with attachment
      if (isImage) {
        // Upload image using Stream Chat API
        const response = await channel.sendImage(file, null, {
          text: `${user?.fullName || user?.firstName || 'User'} uploaded an image`,
        });
        console.log('Image uploaded successfully:', response);
      } else {
        // Upload file using Stream Chat API
        const response = await channel.sendFile(file, null, {
          text: `${user?.fullName || user?.firstName || 'User'} uploaded ${file.name}`,
        });
        console.log('File uploaded successfully:', response);
      }

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload file: ${error.message || 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePollClick = () => {
    try {
      setShowPlusMenu(false);
      setShowPollModal(true);
    } catch (error) {
      console.error('Error opening poll modal:', error);
    }
  };

  const handleCreatePoll = async (pollData) => {
    try {
      if (!channel || !user) return;

      // Create poll data structure with Stream's custom message data
      const pollId = `poll_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

      const pollMessage = {
        text: `📊 ${pollData.question}`,
        type: 'regular',
        customType: 'poll',
        poll_id: pollId,
        poll_question: pollData.question,
        poll_options: pollData.options.map((option, index) => ({
          id: index,
          text: option,
          votes: [],
        })),
        poll_created_by: user.id,
        poll_created_at: new Date().toISOString(),
      };

      // Send poll message using Stream Chat API
      const response = await channel.sendMessage(pollMessage);
      console.log('Poll created successfully:', response);

      setShowPollModal(false);
    } catch (error) {
      console.error('Error creating poll:', error);
      alert(`Failed to create poll: ${error.message || 'Please try again.'}`);
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

  const PollModal = ({ onClose, onSubmit }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const addOption = () => {
      if (options.length < 10) {
        setOptions([...options, '']);
      }
    };

    const updateOption = (index, value) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    };

    const removeOption = (index) => {
      if (options.length > 2) {
        setOptions(options.filter((_, i) => i !== index));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const validOptions = options.filter(opt => opt.trim());
      if (question.trim() && validOptions.length >= 2) {
        onSubmit({ question: question.trim(), options: validOptions });
      }
    };

    return (
      <div className="poll-modal-overlay" onClick={onClose}>
        <div className="poll-modal" onClick={(e) => e.stopPropagation()}>
          <div className="poll-modal__header">
            <h2>Create a poll</h2>
            <button className="poll-modal__close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="poll-modal__form">
            <div className="poll-modal__field">
              <label htmlFor="poll-question">Question</label>
              <input
                id="poll-question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                required
                autoFocus
              />
            </div>

            <div className="poll-modal__field">
              <label>Options</label>
              {options.map((option, index) => (
                <div key={index} className="poll-option-input">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      className="poll-option-remove"
                      onClick={() => removeOption(index)}
                      aria-label="Remove option"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              {options.length < 10 && (
                <button type="button" className="poll-add-option" onClick={addOption}>
                  <Plus size={16} />
                  Add option
                </button>
              )}
            </div>

            <div className="poll-modal__footer">
              <button type="button" className="poll-modal__button poll-modal__button--cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="poll-modal__button poll-modal__button--submit"
                disabled={!question.trim() || options.filter(opt => opt.trim()).length < 2}
              >
                Create poll
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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

          {/* Text Input Area - ContentEditable for WYSIWYG */}
          <div className="slack-text-input__container">
            <div
              ref={editorRef}
              className="slack-text-input"
              contentEditable="true"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              data-placeholder={getPlaceholderText()}
              aria-label={getPlaceholderText()}
              role="textbox"
              aria-multiline="true"
              suppressContentEditableWarning={true}
              style={{
                minHeight: '24px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
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
            <div className="slack-action-toolbar__prefix" ref={plusButtonRef}>
              <button
                className="slack-action-button"
                onClick={handlePlusClick}
                aria-label="Attach"
                data-qa="shortcuts_menu_trigger"
                type="button"
              >
                <Plus size={18} strokeWidth={1.5} />
              </button>

              {/* Plus Menu Dropdown */}
              {showPlusMenu && (
                <div className="plus-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="plus-menu-item"
                    onClick={handleFileSelect}
                    disabled={isUploading}
                  >
                    <Upload size={20} />
                    <div className="plus-menu-item__content">
                      <span className="plus-menu-item__title">Upload a file</span>
                      <span className="plus-menu-item__subtitle">
                        {isUploading ? 'Uploading...' : 'Share images, documents, and more'}
                      </span>
                    </div>
                  </button>
                  <button className="plus-menu-item" onClick={handlePollClick}>
                    <BarChart3 size={20} />
                    <div className="plus-menu-item__content">
                      <span className="plus-menu-item__title">Create a poll</span>
                      <span className="plus-menu-item__subtitle">Get feedback from your team</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden-file-input"
                onChange={handleFileUpload}
                accept="*/*"
                aria-hidden="true"
              />
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
              <ActionButton icon={Paperclip} label="Attach file" dataQa="paperclip_button" />

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

      {/* Poll Modal */}
      {showPollModal && (
        <PollModal onClose={() => setShowPollModal(false)} onSubmit={handleCreatePoll} />
      )}
    </div>
  );
};

export default SlackMessageInput;