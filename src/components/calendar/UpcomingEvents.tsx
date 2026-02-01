import { format, isToday, isTomorrow, differenceInMinutes } from 'date-fns';
import { CalendarEvent } from '@/types/flowstate';
import { EventItem } from '@/components/timeline/EventItem';
import { cn } from '@/lib/utils';

interface UpcomingEventsProps {
  events: CalendarEvent[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const now = new Date();
  
  const upcomingEvents = events
    .filter((event) => event.startTime > now || event.endTime > now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 5);

  const getTimeUntil = (event: CalendarEvent) => {
    const minutes = differenceInMinutes(event.startTime, now);
    if (minutes < 0) return 'Now';
    if (minutes < 60) return `in ${minutes}m`;
    if (minutes < 1440) return `in ${Math.floor(minutes / 60)}h`;
    return format(event.startTime, 'MMM d');
  };

  return (
    <div className="p-4 bg-card rounded-xl border shadow-soft">
      <h3 className="font-display font-medium text-foreground mb-4">
        Coming Up
      </h3>

      {upcomingEvents.length > 0 ? (
        <div className="space-y-3">
          {upcomingEvents.map((event) => {
            const timeLabel = getTimeUntil(event);
            const isNow = differenceInMinutes(event.startTime, now) <= 0 && event.endTime > now;
            
            return (
              <div key={event.id} className="relative">
                {isNow && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-soft" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-xs font-medium",
                    isNow ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {timeLabel}
                  </span>
                </div>
                <EventItem event={event} compact />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No upcoming events
        </p>
      )}
    </div>
  );
}
