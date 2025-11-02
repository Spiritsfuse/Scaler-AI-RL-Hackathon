import { useMemo } from 'react';
import { useChannelStateContext } from 'stream-chat-react';
import { useUser } from '@clerk/clerk-react';

/**
 * Custom hook to extract and compute channel information
 * This centralizes logic for determining if a channel is a DM,
 * getting member info, etc.
 *
 * @returns {Object} Channel information
 * @returns {boolean} isDM - Whether the channel is a Direct Message
 * @returns {boolean} isSelfDM - Whether the user is DMing themselves
 * @returns {Object|null} otherUser - The other user in a 1-on-1 DM
 * @returns {Array} allMembers - All channel members
 * @returns {number} memberCount - Total member count
 * @returns {Object|null} channel - The channel object
 */
export const useChannelInfo = () => {
  const { channel } = useChannelStateContext();
  const { user } = useUser();

  const channelInfo = useMemo(() => {
    try {
      if (!channel || !user) {
        return {
          isDM: false,
          isSelfDM: false,
          otherUser: null,
          allMembers: [],
          memberCount: 0,
          channel: null,
        };
      }

      const memberCount = channel.state?.members
        ? Object.keys(channel.state.members).length
        : 0;

      const allMembers = channel.state?.members
        ? Object.values(channel.state.members)
        : [];

      // Check if it's a DM: 2 members and channel ID includes 'user_'
      const isDM = memberCount === 2 && channel.data?.id?.includes('user_');

      // Check if it's a self-DM: both members are the same user
      const isSelfDM = memberCount === 2 && allMembers.every(
        member => member.user.id === user.id
      );

      // Get the other user in a 1-on-1 DM
      const otherUser = isDM && !isSelfDM
        ? allMembers.find(member => member.user.id !== user.id)
        : null;

      return {
        isDM,
        isSelfDM,
        otherUser,
        allMembers,
        memberCount,
        channel,
      };
    } catch (error) {
      console.error('Error in useChannelInfo:', error);
      return {
        isDM: false,
        isSelfDM: false,
        otherUser: null,
        allMembers: [],
        memberCount: 0,
        channel: null,
      };
    }
  }, [channel, user]);

  return channelInfo;
};
