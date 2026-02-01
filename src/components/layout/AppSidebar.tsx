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
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  return (
    <aside 
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo & Focus Mode */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="font-display text-xl font-semibold text-foreground">
            Flowstate
          </h1>
        )}
        <Button
          variant={focusMode ? "focus" : "ghost"}
          size="icon-sm"
          onClick={onToggleFocus}
          className={cn(
            "transition-all duration-300",
            focusMode && "animate-pulse-soft"
          )}
          title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
        >
          {focusMode ? <Moon className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground font-normal"
            size="sm"
          >
            <Search className="h-4 w-4 mr-2" />
            Search...
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              ⌘K
            </kbd>
          </Button>
        </div>
      )}

      {/* Compose Button */}
      <div className="px-3 pb-4">
        <Button 
          variant="accent" 
          className={cn("w-full", isCollapsed && "px-0")}
          size={isCollapsed ? "icon" : "default"}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>Compose</span>}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {mainNav.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              activeView === item.id
                ? "bg-secondary text-foreground shadow-soft"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
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
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Spaces
            </h3>
            {spaceNav.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeView === item.id
                    ? "bg-secondary text-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-200"
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
