import { useState, useEffect } from 'react';
import { useChannelStateContext } from 'stream-chat-react';
import { useUser } from '@clerk/clerk-react';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import '../styles/poll-message.css';

/**
 * Custom Poll Message Component
 * Displays polls with voting functionality using Stream Chat's API
 */
const CustomPollMessage = ({ message }) => {
  const { channel } = useChannelStateContext();
  const { user } = useUser();
  const [pollOptions, setPollOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Safety check
  if (!message || !message.poll_question || !message.poll_options) {
    console.error('Invalid poll message:', message);
    return null;
  }

  // Initialize poll options from message data
  useEffect(() => {
    if (message?.poll_options) {
      setPollOptions(message.poll_options);

      // Check if current user has already voted
      const userVoted = message.poll_options.some(option =>
        option.votes?.includes(user?.id)
      );
      setHasVoted(userVoted);
    }
  }, [message, user]);

  const handleVote = async (optionId) => {
    try {
      if (!channel || !user || hasVoted || isVoting) {
        console.log('Vote blocked:', { channel: !!channel, user: !!user, hasVoted, isVoting });
        return;
      }

      setIsVoting(true);

      // Update the poll options with the new vote
      const updatedOptions = pollOptions.map(option => {
        if (option.id === optionId) {
          return {
            ...option,
            votes: [...(option.votes || []), user.id],
          };
        }
        return option;
      });

      // Update the message with new poll data using Stream's API
      const response = await channel.partialUpdateMessage(message.id, {
        set: {
          poll_options: updatedOptions,
        },
      });

      console.log('Vote recorded successfully:', response);
      setPollOptions(updatedOptions);
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting on poll:', error);
      alert(`Failed to vote: ${error.message || 'Please try again.'}`);
    } finally {
      setIsVoting(false);
    }
  };

  const getTotalVotes = () => {
    return pollOptions.reduce((total, option) => total + (option.votes?.length || 0), 0);
  };

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const getUserVotedOption = () => {
    return pollOptions.find(option => option.votes?.includes(user?.id));
  };

  const totalVotes = getTotalVotes();
  const userVotedOption = getUserVotedOption();

  return (
    <div className="poll-message">
      <div className="poll-message__header">
        <BarChart3 size={20} className="poll-message__icon" />
        <h3 className="poll-message__question">{message.poll_question}</h3>
      </div>

      <div className="poll-message__options">
        {pollOptions.map((option) => {
          const votes = option.votes?.length || 0;
          const percentage = getPercentage(votes);
          const isUserVote = userVotedOption?.id === option.id;

          return (
            <button
              key={option.id}
              className={`poll-option ${hasVoted ? 'poll-option--voted' : ''} ${isUserVote ? 'poll-option--user-vote' : ''}`}
              onClick={() => !hasVoted && handleVote(option.id)}
              disabled={hasVoted || isVoting}
            >
              <div className="poll-option__content">
                <div className="poll-option__text">
                  {isUserVote && <CheckCircle2 size={16} className="poll-option__check" />}
                  <span>{option.text}</span>
                </div>
                {hasVoted && (
                  <div className="poll-option__stats">
                    <span className="poll-option__votes">{votes} {votes === 1 ? 'vote' : 'votes'}</span>
                    <span className="poll-option__percentage">{percentage}%</span>
                  </div>
                )}
              </div>
              {hasVoted && (
                <div
                  className="poll-option__bar"
                  style={{ width: `${percentage}%` }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="poll-message__footer">
        <span className="poll-message__total">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </span>
        {hasVoted && (
          <span className="poll-message__voted-label">You voted</span>
        )}
      </div>
    </div>
  );
};

export default CustomPollMessage;
