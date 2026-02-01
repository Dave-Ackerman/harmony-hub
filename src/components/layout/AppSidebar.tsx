import { useState } from 'react';
import { 
  Inbox, 
  Calendar, 
  Send, 
  Archive, 
  Star, 
  Clock, 
  Users, 
  Settings,
  Plus,
  Search,
  Zap,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isActive?: boolean;
}

const mainNav: NavItem[] = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, badge: 12 },
  { id: 'today', label: 'Today', icon: Calendar },
  { id: 'starred', label: 'Starred', icon: Star, badge: 3 },
  { id: 'snoozed', label: 'Snoozed', icon: Clock },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'archive', label: 'Archive', icon: Archive },
];

const spaceNav: NavItem[] = [
  { id: 'team', label: 'Team', icon: Users },
];

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  focusMode: boolean;
  onToggleFocus: () => void;
}

export function AppSidebar({ activeView, onViewChange, focusMode, onToggleFocus }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-card shadow-medium border touch-target"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col h-full bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border transition-all duration-300 ease-out",
          // Desktop
          "hidden lg:flex",
          isCollapsed ? "w-20" : "w-72",
          // Mobile
          isMobileOpen && "!flex fixed inset-y-0 left-0 z-50 w-80 animate-slide-in-left shadow-elevated"
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border/50">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-soft">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="font-display text-xl font-semibold text-foreground tracking-tight">
                Flowstate
              </h1>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {/* Mobile Close */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Desktop Collapse */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform duration-300",
                isCollapsed && "rotate-180"
              )} />
            </Button>
          </div>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground font-normal h-11 rounded-xl border-border/50 bg-background/50 hover:bg-background"
              size="sm"
            >
              <Search className="h-4 w-4 mr-3 text-muted-foreground" />
              <span className="text-sm">Search...</span>
              <kbd className="ml-auto pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded-md border bg-muted/50 px-1.5 font-mono text-[10px] font-medium opacity-75">
                ⌘K
              </kbd>
            </Button>
          </div>
        )}

        {/* Compose Button */}
        <div className="px-4 pb-4">
          <Button 
            variant="default" 
            className={cn(
              "w-full h-11 rounded-xl font-medium shadow-soft gradient-accent border-0 hover:opacity-90 transition-all duration-300",
              isCollapsed && "px-0"
            )}
            size={isCollapsed ? "icon" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Compose</span>}
          </Button>
        </div>

        {/* Focus Mode Toggle */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <button
              onClick={onToggleFocus}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 touch-target",
                focusMode 
                  ? "bg-focus/15 border border-focus/30 shadow-soft" 
                  : "bg-muted/30 hover:bg-muted/50 border border-transparent"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors duration-300",
                focusMode ? "bg-focus/20" : "bg-muted"
              )}>
                <Zap className={cn(
                  "h-4 w-4 transition-colors duration-300",
                  focusMode ? "text-focus" : "text-muted-foreground"
                )} />
              </div>
              <div className="flex-1 text-left">
                <span className={cn(
                  "text-sm font-medium block",
                  focusMode ? "text-focus" : "text-foreground"
                )}>
                  Focus Mode
                </span>
                <span className="text-xs text-muted-foreground">
                  {focusMode ? "Active" : "Off"}
                </span>
              </div>
              <div className={cn(
                "w-10 h-6 rounded-full transition-colors duration-300 relative",
                focusMode ? "bg-focus" : "bg-muted"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                  focusMode ? "translate-x-5" : "translate-x-1"
                )} />
              </div>
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {mainNav.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 touch-target",
                "animate-fade-in-up",
                activeView === item.id
                  ? "bg-secondary text-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-colors duration-200",
                activeView === item.id && "text-accent"
              )} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium transition-colors duration-200",
                      activeView === item.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}

          {/* Spaces Section */}
          {!isCollapsed && (
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Spaces
              </h3>
              {spaceNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 touch-target",
                    activeView === item.id
                      ? "bg-secondary text-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border/50 space-y-2">
          <ThemeToggle variant={isCollapsed ? 'icon' : 'full'} className={cn(
            !isCollapsed && "w-full"
          )} />
          
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-200 touch-target",
              isCollapsed && "justify-center"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
