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
import CanvasView from "../components/CanvasView";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("Messages"); // Track active tab
  const [canvasTitle, setCanvasTitle] = useState(""); // Track canvas title

  const { chatClient, error, isLoading } = useStreamChat();

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

  return (
    <Chat client={chatClient}>
      <SlackLayout
        chatClient={chatClient}
        activeChannel={activeChannel}
        setActiveChannel={(channel) => {
          setActiveChannel(channel);
          setSearchParams({ channel: channel.id });
        }}
        onCreateChannel={() => setIsCreateModalOpen(true)}
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
                <MessageList />
                <SlackMessageInput />
              </>
            ) : (
              <CanvasView setCanvasTitle={setCanvasTitle} />
            )}
          </Window>
          <Thread />
        </Channel>
      </SlackLayout>

      {isCreateModalOpen && <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />}
    </Chat>
  );
};
export default HomePage;