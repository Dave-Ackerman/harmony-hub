import { useMemo, useState } from 'react';
import { format, isToday, isSameDay, startOfDay } from 'date-fns';
import { EmailThread, CalendarEvent, TimelineItem } from '@/types/flowstate';
import { EmailItem } from './EmailItem';
import { EventItem } from './EventItem';
import { cn } from '@/lib/utils';
import { Sparkles, Inbox } from 'lucide-react';

interface TimelineProps {
  emails: EmailThread[];
  events: CalendarEvent[];
  focusMode: boolean;
}

interface GroupedItems {
  date: Date;
  items: TimelineItem[];
}

function groupByDate(items: TimelineItem[]): GroupedItems[] {
  const groups = new Map<string, TimelineItem[]>();

  items.forEach((item) => {
    const date = item.type === 'email' ? item.timestamp : item.startTime;
    const key = startOfDay(date).toISOString();
    const existing = groups.get(key) || [];
    groups.set(key, [...existing, item]);
  });

  return Array.from(groups.entries())
    .map(([key, groupItems]) => ({
      date: new Date(key),
      items: groupItems.sort((a, b) => {
        const aTime = a.type === 'email' ? a.timestamp : a.startTime;
        const bTime = b.type === 'email' ? b.timestamp : b.startTime;
        return bTime.getTime() - aTime.getTime();
      }),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function getDateLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(date, tomorrow)) return 'Tomorrow';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return format(date, 'EEEE, MMMM d');
}

export function Timeline({ emails, events, focusMode }: TimelineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allItems: TimelineItem[] = useMemo(() => {
    if (focusMode) {
      const filteredEmails = emails.filter(
        (e) => e.priority === 'urgent' || e.priority === 'high' || e.isStarred
      );
      return [...filteredEmails, ...events];
    }
    return [...emails, ...events];
  }, [emails, events, focusMode]);

  const grouped = useMemo(() => groupByDate(allItems), [allItems]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin lg:scrollbar-hide">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 space-y-8">
        {grouped.map(({ date, items }, groupIndex) => (
          <section key={date.toISOString()} className="animate-fade-in-up" style={{ animationDelay: `${groupIndex * 100}ms` }}>
            {/* Date Header */}
            <div className="sticky top-0 z-10 py-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle border border-border/30 shadow-xs">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isToday(date) ? "bg-accent animate-pulse-soft" : "bg-muted-foreground/30"
                )} />
                <h2 className="text-sm font-semibold text-foreground">
                  {getDateLabel(date)}
                </h2>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3 mt-3">
              {items.map((item, itemIndex) => (
                <div 
                  key={item.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(groupIndex * 100) + (itemIndex * 50)}ms` }}
                >
                  {item.type === 'email' ? (
                    <EmailItem
                      email={item}
                      isSelected={selectedId === item.id}
                      onClick={() => setSelectedId(item.id)}
                    />
                  ) : (
                    <EventItem
                      event={item}
                      isSelected={selectedId === item.id}
                      onClick={() => setSelectedId(item.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Empty State */}
        {allItems.length === 0 && (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
              {focusMode ? (
                <Sparkles className="h-10 w-10 text-focus animate-float" />
              ) : (
                <Inbox className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">
              {focusMode ? 'Focus time!' : 'All caught up'}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {focusMode
                ? 'No priority items. Enjoy your distraction-free focus time.'
                : 'You\'re all caught up. Take a moment to breathe.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
