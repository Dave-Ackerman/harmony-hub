import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Timeline } from '@/components/timeline/Timeline';
import { ContextPanel } from '@/components/panels/ContextPanel';
import { QuickCompose } from '@/components/compose/QuickCompose';
import { mockEmails, mockEvents } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeView, setActiveView] = useState('inbox');
  const [focusMode, setFocusMode] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Would open search
      }
      // C for compose
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsComposeOpen(true);
      }
      // F for focus mode
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setFocusMode((prev) => !prev);
      }
      // Escape to close compose
      if (e.key === 'Escape') {
        setIsComposeOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getViewTitle = () => {
    switch (activeView) {
      case 'inbox':
        return 'Inbox';
      case 'today':
        return 'Today';
      case 'starred':
        return 'Starred';
      case 'snoozed':
        return 'Snoozed';
      case 'sent':
        return 'Sent';
      case 'archive':
        return 'Archive';
      case 'team':
        return 'Team Space';
      default:
        return 'Inbox';
    }
  };

  return (
    <div className={cn(
      "flex h-screen overflow-hidden transition-colors duration-500",
      focusMode && "bg-focus/5"
    )}>
      {/* Sidebar */}
      <AppSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode(!focusMode)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 px-6 py-4 border-b bg-background/80 glass">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                {getViewTitle()}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {focusMode 
                  ? 'Showing priority items only' 
                  : `${mockEmails.filter(e => !e.isRead).length} unread • ${mockEvents.length} events today`
                }
              </p>
            </div>

            {/* Time Display */}
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Timeline */}
          <Timeline
            emails={mockEmails}
            events={mockEvents}
            focusMode={focusMode}
          />

          {/* Context Panel */}
          <ContextPanel
            events={mockEvents}
            focusMode={focusMode}
          />
        </div>
      </main>

      {/* Quick Compose Modal */}
      <QuickCompose
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />

      {/* Focus Mode Indicator */}
      {focusMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-focus text-focus-foreground shadow-elevated animate-slide-up flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-focus-foreground animate-pulse-soft" />
          <span className="text-sm font-medium">Focus Mode Active</span>
          <kbd className="ml-2 px-1.5 py-0.5 rounded bg-focus-foreground/20 text-[10px] font-mono">
            F
          </kbd>
        </div>
      )}
    </div>
  );
};

export default Index;
