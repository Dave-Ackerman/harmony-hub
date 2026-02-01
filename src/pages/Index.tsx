import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Timeline } from '@/components/timeline/Timeline';
import { ContextPanel } from '@/components/panels/ContextPanel';
import { QuickCompose } from '@/components/compose/QuickCompose';
import { mockEmails, mockEvents } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Sparkles, X, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsComposeOpen(true);
      }
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setFocusMode((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsComposeOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getViewTitle = () => {
    switch (activeView) {
      case 'inbox': return 'Inbox';
      case 'today': return 'Today';
      case 'starred': return 'Starred';
      case 'snoozed': return 'Snoozed';
      case 'sent': return 'Sent';
      case 'archive': return 'Archive';
      case 'team': return 'Team Space';
      default: return 'Inbox';
    }
  };

  return (
    <div className={cn(
      "flex h-screen overflow-hidden transition-all duration-500",
      focusMode && "gradient-mesh"
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
        <header className="shrink-0 px-4 lg:px-8 py-4 lg:py-5 border-b glass">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="pl-14 lg:pl-0">
              <h1 className="font-display text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
                {getViewTitle()}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                {focusMode ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-focus" />
                    <span className="text-focus font-medium">Focus mode active</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">{mockEmails.filter(e => !e.isRead).length} unread</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{mockEvents.length} events today</span>
                  </>
                )}
              </p>
            </div>

            {/* Time Display */}
            <div className="text-right hidden sm:block">
              <p className="text-xl lg:text-2xl font-display font-semibold text-foreground tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl bg-card/90 backdrop-blur-xl border shadow-elevated animate-slide-up flex items-center gap-3">
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-focus absolute animate-ping opacity-50" />
            <span className="w-2.5 h-2.5 rounded-full bg-focus relative block" />
          </div>
          <span className="text-sm font-medium text-foreground">Focus Mode Active</span>
          <kbd className="px-2 py-1 rounded-lg bg-muted text-[10px] font-mono font-medium text-muted-foreground">
            F
          </kbd>
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => setFocusMode(false)}
            className="ml-1 h-7 w-7 rounded-lg hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Mobile Compose FAB */}
      <button
        onClick={() => setIsComposeOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl gradient-accent shadow-elevated flex items-center justify-center touch-target animate-fade-in-up"
      >
        <span className="text-white text-2xl font-light">+</span>
      </button>
    </div>
  );
};

export default Index;
