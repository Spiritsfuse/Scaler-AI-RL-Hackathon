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
} from "stream-chat-react";

import "../styles/stream-chat-theme.css";
import CreateChannelModal from "../components/CreateChannelModal";
import CustomChannelHeader from "../components/CustomChannelHeader";
import SlackLayout from "../components/SlackLayout";
import SlackMessageInput from "../components/SlackMessageInput";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [searchParams, setSearchParams] = useSearchParams();

  const { chatClient, error, isLoading } = useStreamChat();

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

  return (
    <Chat client={chatClient}>
      <SlackLayout
        chatClient={chatClient}
        activeChannel={activeChannel}
        setActiveChannel={handleSetActiveChannel}
        onCreateChannel={() => setIsCreateModalOpen(true)}
        activeView={activeView}
        onViewChange={handleViewChange}
      >
        <Channel channel={activeChannel}>
          <Window>
            <CustomChannelHeader />
            <MessageList />
            <SlackMessageInput />
          </Window>
          <Thread />
        </Channel>
      </SlackLayout>

      {isCreateModalOpen && <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />}
    </Chat>
  );
};
export default HomePage;