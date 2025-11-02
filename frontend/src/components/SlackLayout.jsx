import MainSidebar from './MainSidebar';
import TopHeader from './TopHeader';
import NavSidebar from './NavSidebar';
import DMPanel from './DMPanel';
import ActivityPanel from './ActivityPanel';
import LaterPanel from './LaterPanel';
import DirectoriesPanel from './DirectoriesPanel';
import DraftsSentPanel from './DraftsSentPanel';
import ResizablePanel from './ResizablePanel';
import '../styles/slack-layout.css';

const SlackLayout = ({
  chatClient,
  activeChannel,
  setActiveChannel,
  onCreateChannel,
  activeView,
  onViewChange,
  onCreateAction,
  onOpenProfile,
  children
}) => {
  const handleOpenDirectories = () => {
    onViewChange?.('directories');
  };

  const handleOpenDraftsSent = () => {
    onViewChange?.('drafts-sent');
  };

  return (
    <div className="slack-layout">
      {/* Far Left Sidebar */}
      <MainSidebar
        activeView={activeView}
        onViewChange={onViewChange}
        onCreateAction={onCreateAction}
        onOpenProfile={onOpenProfile}
      />

      {/* Main Area (everything except far left sidebar) */}
      <div className="slack-layout__main">
        {/* Top Header */}
        <TopHeader />

        {/* Content Area (Nav Sidebar + Channel Content OR DM Panel + Chat OR Activity Panel OR Later Panel) */}
        <div className="slack-layout__content">
          {activeView === 'drafts-sent' ? (
            <>
              {/* Drafts & Sent Panel - full width */}
              <div className="slack-layout__channel slack-layout__channel--full">
                <DraftsSentPanel />
              </div>
            </>
          ) : activeView === 'directories' ? (
            <>
              {/* Directories Panel - full width */}
              <div className="slack-layout__channel slack-layout__channel--full">
                <DirectoriesPanel />
              </div>
            </>
          ) : activeView === 'later' ? (
            <>
              {/* Later Panel - saved messages and reminders with resize capability */}
              <ResizablePanel minWidth={300} maxWidth={600} defaultWidth={400}>
                <LaterPanel />
              </ResizablePanel>

              {/* Content Area - can show onboarding or empty state */}
              <div className="slack-layout__channel">
                {children}
              </div>
            </>
          ) : activeView === 'activity' ? (
            <>
              {/* Activity Panel - notification center with resize capability */}
              <ResizablePanel minWidth={300} maxWidth={600} defaultWidth={400}>
                <ActivityPanel />
              </ResizablePanel>

              {/* Content Area - can show onboarding or empty state */}
              <div className="slack-layout__channel">
                {children}
              </div>
            </>
          ) : activeView === 'dms' ? (
            <>
              {/* DM Panel - sidebar for DMs with resize capability */}
              <ResizablePanel minWidth={200} maxWidth={500} defaultWidth={260}>
                <DMPanel
                  activeChannel={activeChannel}
                  setActiveChannel={setActiveChannel}
                />
              </ResizablePanel>

              {/* Chat Content Area */}
              <div className="slack-layout__channel">
                {children}
              </div>
            </>
          ) : (
            <>
              {/* Nav Sidebar - with resize capability */}
              <ResizablePanel minWidth={200} maxWidth={500} defaultWidth={260}>
                <NavSidebar
                  chatClient={chatClient}
                  activeChannel={activeChannel}
                  setActiveChannel={setActiveChannel}
                  onCreateChannel={onCreateChannel}
                  onOpenDirectories={handleOpenDirectories}
                  onOpenDraftsSent={handleOpenDraftsSent}
                />
              </ResizablePanel>

              {/* Channel Content Area */}
              <div className="slack-layout__channel">
                {children}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlackLayout;