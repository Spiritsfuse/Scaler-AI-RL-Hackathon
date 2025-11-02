import MainSidebar from './MainSidebar';
import TopHeader from './TopHeader';
import NavSidebar from './NavSidebar';
import DMPanel from './DMPanel';
import ActivityPanel from './ActivityPanel';
import LaterPanel from './LaterPanel';
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
          {activeView === 'later' ? (
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
              {/* Nav Sidebar */}
              <NavSidebar
                chatClient={chatClient}
                activeChannel={activeChannel}
                setActiveChannel={setActiveChannel}
                onCreateChannel={onCreateChannel}
              />

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