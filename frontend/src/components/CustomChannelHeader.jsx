import {
  Star,
  Headphones,
  ChevronDown,
  Search,
  MoreVertical,
  MessageSquare,
  FileText,
  Plus,
  Hash,
  LockIcon,
} from "lucide-react";
import { useChannelStateContext } from "stream-chat-react";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import MembersModal from "./MembersModal";
import PinnedMessagesModal from "./PinnedMessagesModal";
import InviteModal from "./InviteModal";

/**
 * A helper component to display stacked member avatars
 * Shows real member profile images from the channel (up to 3 members)
 */
const MemberAvatars = ({ members, count, onClick }) => {
  // Get first 3 members to display
  const displayMembers = members.slice(0, 3);

  return (
    <button
      className="flex items-center gap-1.5 hover:bg-gray-50 transition-colors duration-75 py-0.5 px-2 rounded"
      onClick={onClick}
      title={`${count} members`}
    >
      <div className="flex -space-x-1.5 overflow-hidden">
        {displayMembers.map((member, index) => (
          <div key={member.user.id} style={{ zIndex: displayMembers.length - index }}>
            {member.user.image ? (
              <img
                className="inline-block size-5 rounded-full ring-2 ring-white"
                src={member.user.image}
                alt={member.user.name || member.user.id}
              />
            ) : (
              <div className="inline-block size-5 rounded-full ring-2 ring-white bg-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                {(member.user.name || member.user.id).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>
      <span className="text-xs font-medium text-gray-700">{count}</span>
    </button>
  );
};

/**
 * The new CustomChannelHeader component with a two-row layout
 */
const CustomChannelHeader = ({ activeTab, setActiveTab }) => {
  const { channel } = useChannelStateContext();
  const { user } = useUser();
  const navigate = useNavigate();

  // --- Existing State ---
  const [showInvite, setShowInvite] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  // Kept old state for PinnedMessagesModal, though the button is removed
  // from this UI spec. Can be wired up to the 'MoreVertical' button later.
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);

  // --- New State ---
  const [isStarred, setIsStarred] = useState(false);

  // --- Existing Logic ---
  // Added try/catch for robustness, though data access is usually safe.
  let memberCount = 0;
  let allMembers = [];
  let otherUser = null;
  let isDM = false;

  try {
    memberCount = channel.state.members ? Object.keys(channel.state.members).length : 0;
    allMembers = channel.state.members ? Object.values(channel.state.members) : [];

    otherUser = allMembers.find(
      (member) => member.user.id !== user.id
    );

    isDM = channel.data?.member_count === 2 && channel.data?.id.includes("user_");
  } catch (error) {
    console.error("Error processing channel state:", error);
  }
  // --- End Existing Logic ---

  // --- Event Handlers (with try/catch as requested) ---

  const handleShowMembers = () => {
    try {
      setShowMembers(true);
    } catch (error) {
      console.error("Failed to show members modal:", error);
    }
  };

  const handleShowInvite = () => {
    try {
      setShowInvite(true);
    } catch (error) {
      console.error("Failed to show invite modal:", error);
    }
  };

  // Handler for showing pinned messages (wired to More button)
  const handleShowPinned = async () => {
    try {
      const channelState = await channel.query();
      setPinnedMessages(channelState.pinned_messages);
      setShowPinnedMessages(true);
    } catch (error) {
      console.error("Failed to fetch pinned messages:", error);
    }
  };

  // Star toggle handler
  const handleToggleStar = () => {
    try {
      setIsStarred(!isStarred);
    } catch (error) {
      console.error("Failed to toggle star:", error);
    }
  };

  // Huddle/video call handler - starts a call with camera off by default
  const handleHuddle = async () => {
    try {
      if (channel) {
        // Create a unique call ID based on channel ID and timestamp
        const callId = `call-${channel.id}-${Date.now()}`;

        // Send notification message to channel about the huddle
        await channel.sendMessage({
          text: `🎧 ${user.fullName || user.firstName || 'Someone'} started a huddle. Click to join: ${window.location.origin}/call/${callId}`,
        });

        // Navigate to the call page (huddle = video call with camera off)
        navigate(`/call/${callId}`);
      }
    } catch (error) {
      console.error("Failed to start huddle:", error);
    }
  };

  // --- Render ---
  return (
    <div className="bg-white">
      {/* Row 1: Channel Title & Actions - Compact */}
      <div className="flex items-center justify-between px-5 py-1.5">
        {/* Left Side (Channel Info) */}
        <div className="flex items-center gap-1.5">
          <button
            title={isStarred ? "Unstar channel" : "Star channel"}
            onClick={handleToggleStar}
            className={`p-1 rounded-full transition-colors duration-75 ${
              isStarred ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Star
              className={`size-4 ${isStarred ? 'fill-yellow-500 stroke-yellow-500' : 'stroke-gray-600 fill-none'}`}
            />
          </button>
          <div className="flex items-center gap-1">
            {isDM ? (
              otherUser?.user?.image && (
                <img
                  src={otherUser.user.image}
                  alt={otherUser.user.name || otherUser.user.id}
                  className="size-5 rounded-full object-cover"
                />
              )
            ) : channel.data?.private ? (
              <LockIcon className="size-4 text-slate-900" />
            ) : (
              <Hash className="size-4 text-slate-900" />
            )}
            <h1 className="font-bold text-base text-slate-900">
              {isDM ? otherUser?.user?.name || otherUser?.user?.id : channel.data?.id || "general"}
            </h1>
          </div>
        </div>

        {/* Right Side (Channel Actions) */}
        <div className="flex items-center gap-2">
          {/* Kept existing "Invite" button logic for private channels */}
          {channel.data?.private && (
            <button
              className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors duration-75"
              onClick={handleShowInvite}
            >
              Invite
            </button>
          )}

          <MemberAvatars
            members={allMembers}
            count={memberCount}
            onClick={handleShowMembers}
          />

          <button
            className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-75"
            onClick={handleHuddle}
          >
            <Headphones className="size-4" />
            <span className="text-xs font-medium">Huddle</span>
            <ChevronDown className="size-3" />
          </button>

          <button
            className="p-1 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-75"
            aria-label="Search"
          >
            <Search className="size-4" />
          </button>

          <button
            className="p-1 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-75"
            aria-label="More actions"
            onClick={handleShowPinned}
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>

      {/* Row 2: View Navigation (Tabs) */}
      <div className="flex items-center border-b border-gray-200 px-6">
        {/* Messages Tab (Active) */}
        <button
          className={`flex items-center gap-2 pb-2 px-2 ${
            activeTab === "Messages"
              ? "border-b-2 border-purple-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Messages")}
          role="tab"
          aria-selected={activeTab === "Messages"}
        >
          <MessageSquare className={`size-5 ${
            activeTab === "Messages" ? "text-black" : "text-gray-500"
          }`} />
          <span className={`font-semibold ${
            activeTab === "Messages" ? "text-black" : "text-gray-500"
          }`}>
            Messages
          </span>
        </button>

        {/* Add Canvas Tab (Inactive - styled as per Slack UI) */}
        <button
          className={`flex items-center gap-2 pb-2 px-2 ml-4 text-gray-500 hover:bg-gray-50 transition-colors duration-75 ${
            activeTab === "Canvas" ? "border-b-2 border-purple-600" : ""
          }`}
          onClick={() => {
            try {
              setActiveTab("Canvas");
            } catch (error) {
              console.error("Failed to open canvas:", error);
            }
          }}
          role="tab"
          aria-selected={activeTab === "Canvas"}
        >
          <FileText className={`size-5 ${
            activeTab === "Canvas" ? "text-black" : "text-gray-500"
          }`} />
          <span className={`font-medium ${
            activeTab === "Canvas" ? "text-black font-semibold" : "text-gray-500"
          }`}>
            Add canvas
          </span>
        </button>

        {/* Add Tab Button */}
        <button
          className="ml-2 pb-2 px-2 text-gray-500 hover:bg-gray-100 rounded transition-colors duration-75"
          aria-label="Add new tab"
        >
          <Plus className="size-5" />
        </button>
      </div>

      {/* Modals */}
      {showMembers && (
        <MembersModal
          members={allMembers}
          onClose={() => setShowMembers(false)}
        />
      )}

      {showPinnedMessages && (
        <PinnedMessagesModal
          pinnedMessages={pinnedMessages}
          onClose={() => setShowPinnedMessages(false)}
        />
      )}

      {showInvite && <InviteModal channel={channel} onClose={() => setShowInvite(false)} />}
    </div>
  );
};

export default CustomChannelHeader;