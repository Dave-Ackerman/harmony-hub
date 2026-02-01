import { format, differenceInMinutes } from 'date-fns';
import { CalendarEvent } from '@/types/flowstate';
import { EventItem } from '@/components/timeline/EventItem';
import { cn } from '@/lib/utils';
import { CalendarClock } from 'lucide-react';

interface UpcomingEventsProps {
  events: CalendarEvent[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const now = new Date();
  
  const upcomingEvents = events
    .filter((event) => event.startTime > now || event.endTime > now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 4);

  const getTimeUntil = (event: CalendarEvent) => {
    const minutes = differenceInMinutes(event.startTime, now);
    if (minutes < 0) return 'Now';
    if (minutes < 60) return `in ${minutes}m`;
    if (minutes < 1440) return `in ${Math.floor(minutes / 60)}h`;
    return format(event.startTime, 'MMM d');
  };

  return (
    <div className="p-5 bg-card rounded-2xl border shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-muted/50">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-foreground">
          Coming Up
        </h3>
      </div>

      {upcomingEvents.length > 0 ? (
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => {
            const timeLabel = getTimeUntil(event);
            const isNow = differenceInMinutes(event.startTime, now) <= 0 && event.endTime > now;
            
            return (
              <div 
                key={event.id} 
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {isNow && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse-soft shadow-[0_0_8px_2px_hsl(var(--destructive)/0.4)]" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-md",
                    isNow 
                      ? "text-destructive bg-destructive/10" 
                      : "text-muted-foreground bg-muted/50"
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
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted/30 flex items-center justify-center">
            <CalendarClock className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">
            No upcoming events
          </p>
        </div>
      )}
    </div>
  );
}
