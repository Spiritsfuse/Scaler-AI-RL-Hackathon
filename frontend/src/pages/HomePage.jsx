import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useStreamChat } from "../hooks/useStreamChat.js";
import PageLoader from "../components/PageLoader";
import { UserButton } from "@clerk/clerk-react";


import {
  Chat,
  Channel,
  MessageList,
  Thread,
  Window,
  MessageSimple,
} from "stream-chat-react";

import "../styles/stream-chat-theme.css";
import CreateChannelModal from "../components/CreateChannelModal";
import NewMessageModal from "../components/NewMessageModal";
import InvitePeopleModal from "../components/InvitePeopleModal";
import ProfileEdit from "../components/ProfileEdit";
import CustomChannelHeader from "../components/CustomChannelHeader";
import SlackLayout from "../components/SlackLayout";
import SlackMessageInput from "../components/SlackMessageInput";
import CanvasView from "../components/CanvasView";
import CustomPollMessage from "../components/CustomPollMessage";
import DMInfoPanel from "../components/DMInfoPanel";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("Messages"); // Track active tab
  const [canvasTitle, setCanvasTitle] = useState(""); // Track canvas title

  const { chatClient, error, isLoading } = useStreamChat();

  // Custom message text renderer for polls
  const MessageText = (props) => {
    // Check if this is a poll message
    if (props.message?.customType === 'poll') {
      return <CustomPollMessage message={props.message} />;
    }
    // Return null to let Stream render default text
    return null;
  };

  // Reset canvas title when switching away from Canvas tab
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === "Messages") {
      setCanvasTitle(""); // Clear canvas title when switching to Messages
    }
  };

  // set active channel from URL params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel");
      if (channelId) {
        const channel = chatClient.channel("messaging", channelId);
        setActiveChannel(channel);
      }
    }
  }, [chatClient, searchParams]);

  if (error)
  {
    // console.log(error)
    return <p>Something went wrong...</p>;
  } 
  if (isLoading || !chatClient) return <PageLoader />;
// if (true) return <PageLoader />;

  const handleSetActiveChannel = (channel) => {
    setActiveChannel(channel);
    setSearchParams({ channel: channel.id });
    // If we're setting a channel and not in home or dms view, switch to home
    if (activeView !== 'home' && activeView !== 'dms') {
      setActiveView('home');
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    // If switching to home view and we have an active channel, maintain it
    // If switching to dms and we have a DM channel, maintain it
  };

  // Handle create actions from plus menu
  const handleCreateAction = (actionId) => {
    switch (actionId) {
      case 'message':
        setIsNewMessageModalOpen(true);
        break;
      case 'channel':
        setIsCreateModalOpen(true);
        break;
      case 'huddle':
        alert('Huddle feature coming soon!');
        break;
      case 'canvas':
        alert('Canvas feature coming soon!');
        break;
      case 'list':
        alert('List feature coming soon!');
        break;
      case 'workflow':
        alert('Workflow feature coming soon!');
        break;
      case 'invite':
        setIsInviteModalOpen(true);
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  // Handle message created
  const handleMessageCreated = (channel) => {
    setActiveChannel(channel);
    setSearchParams({ channel: channel.id });
    setActiveView('dms');
  };

  // Handle open profile
  const handleOpenProfile = () => {
    setIsProfileEditOpen(true);
  };

  return (
    <Chat client={chatClient}>
      <SlackLayout
        chatClient={chatClient}
        activeChannel={activeChannel}
        setActiveChannel={handleSetActiveChannel}
        onCreateChannel={() => setIsCreateModalOpen(true)}
        activeView={activeView}
        onViewChange={handleViewChange}
        onCreateAction={handleCreateAction}
        onOpenProfile={handleOpenProfile}
      >
        <Channel channel={activeChannel}>
          <Window>
            <CustomChannelHeader
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              canvasTitle={canvasTitle}
            />
            {activeTab === "Messages" ? (
              <>
                <DMInfoPanel />
                <MessageList MessageText={MessageText} />
                <SlackMessageInput />
              </>
            ) : (
              <CanvasView setCanvasTitle={setCanvasTitle} />
            )}
          </Window>
          <Thread />
        </Channel>
      </SlackLayout>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />
      )}
      {isNewMessageModalOpen && (
        <NewMessageModal
          isOpen={isNewMessageModalOpen}
          onClose={() => setIsNewMessageModalOpen(false)}
          onMessageCreated={handleMessageCreated}
        />
      )}
      {isInviteModalOpen && (
        <InvitePeopleModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}

      {/* Profile Edit */}
      <ProfileEdit
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
      />
    </Chat>
  );
};
export default HomePage;