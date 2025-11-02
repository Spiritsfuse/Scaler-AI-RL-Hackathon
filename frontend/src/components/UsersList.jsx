import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { useChatContext } from "stream-chat-react";
import * as Sentry from "@sentry/react";
import { Edit3 } from 'lucide-react';
import '../styles/users-list.css';

const UsersList = ({ activeChannel }) => {
  const { client } = useChatContext();
  const [_, setSearchParams] = useSearchParams();

  const fetchUsers = useCallback(async () => {
    if (!client?.user) return;

    const response = await client.queryUsers(
      { id: { $ne: client.user.id } },
      { name: 1 },
      { limit: 20 }
    );

    const usersOnly = response.users.filter((user) => !user.id.startsWith("recording-"));

    // Add current user at the end with a special flag
    const currentUser = { ...client.user, isCurrentUser: true };
    
    return [...usersOnly, currentUser];
  }, [client]);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users-list", client?.user?.id],
    queryFn: fetchUsers,
    enabled: !!client?.user,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  // staleTime
  // what it does: tells React Query the data is "fresh" for 5 minutes
  // behavior: during these 5 minutes, React Query WON'T refetch the data automatically

  const startDirectMessage = async (targetUser) => {
    if (!targetUser || !client?.user) return;

    try {
      //  bc stream does not allow channelId to be longer than 64 chars
      const channelId = [client.user.id, targetUser.id].sort().join("-").slice(0, 64);
      const channel = client.channel("messaging", channelId, {
        members: [client.user.id, targetUser.id],
      });
      await channel.watch();
      setSearchParams({ channel: channel.id });
    } catch (error) {
      console.log("Error creating DM", error),
        Sentry.captureException(error, {
          tags: { component: "UsersList" },
          extra: {
            context: "create_direct_message",
            targetUserId: targetUser?.id,
          },
        });
    }
  };

  if (isLoading) return <div className="dm-list-message">Loading users...</div>;
  if (isError) return <div className="dm-list-message">Failed to load users</div>;
  if (!users.length) return <div className="dm-list-message">No other users found</div>;

  return (
    <div className="dm-list">
      {users.map((user) => {
        const channelId = [client.user.id, user.id].sort().join("-").slice(0, 64);
        const channel = client.channel("messaging", channelId, {
          members: [client.user.id, user.id],
        });
        const unreadCount = channel.countUnread();
        const isActive = activeChannel && activeChannel.id === channelId;

        // Get user initials
        const getUserInitial = () => {
          const name = user.name || user.id;
          return name.charAt(0).toUpperCase();
        };

        return (
          <button
            key={user.id}
            onClick={() => !user.isCurrentUser && startDirectMessage(user)}
            className={`dm-item ${isActive ? 'dm-item--active' : ''}`}
            disabled={user.isCurrentUser}
          >
            <div className="dm-item__content">
              <div className="dm-item__avatar">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.id}
                    className="dm-avatar-img"
                  />
                ) : (
                  <div className="dm-avatar-placeholder">
                    <span className="dm-avatar-text">{getUserInitial()}</span>
                  </div>
                )}
                <div className={`dm-status-indicator ${user.online ? 'dm-status-indicator--online' : 'dm-status-indicator--offline'}`}></div>
              </div>

              <span className="dm-item__name">
                {user.name || user.id}
              </span>

              {user.isCurrentUser && (
                <span className="dm-item__you-label">you</span>
              )}

              {unreadCount > 0 && !user.isCurrentUser && (
                <span className="dm-item__badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}

              {!user.isCurrentUser && (
                <Edit3 className="dm-item__edit-icon" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default UsersList;