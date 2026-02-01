import { useMemo, useState } from 'react';
import { format, isToday, isSameDay, startOfDay } from 'date-fns';
import { EmailThread, CalendarEvent, TimelineItem } from '@/types/flowstate';
import { EmailItem } from './EmailItem';
import { EventItem } from './EventItem';
import { cn } from '@/lib/utils';

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
      // In focus mode, only show high priority emails and upcoming events
      const filteredEmails = emails.filter(
        (e) => e.priority === 'urgent' || e.priority === 'high' || e.isStarred
      );
      return [...filteredEmails, ...events];
    }
    return [...emails, ...events];
  }, [emails, events, focusMode]);

  const grouped = useMemo(() => groupByDate(allItems), [allItems]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {grouped.map(({ date, items }) => (
          <section key={date.toISOString()} className="animate-fade-in">
            {/* Date Header */}
            <div className="sticky top-0 z-10 py-2 glass">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {getDateLabel(date)}
              </h2>
            </div>

            {/* Items */}
            <div className="space-y-2 mt-2">
              {items.map((item) => (
                <div key={item.id} className="animate-slide-up">
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

        {allItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {focusMode
                ? 'No priority items. Enjoy your focus time!'
                : 'All clear. Time to take a break.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
