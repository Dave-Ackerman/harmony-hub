import { Video, MapPin, Clock, Zap, ExternalLink } from 'lucide-react';
import { CalendarEvent } from '@/types/flowstate';
import { AvatarGroup } from '@/components/shared/Avatar';
import { cn } from '@/lib/utils';
import { format, differenceInMinutes } from 'date-fns';

interface EventItemProps {
  event: CalendarEvent;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const eventTypeStyles = {
  meeting: {
    bg: 'bg-event-meeting/10',
    border: 'border-event-meeting/20',
    accent: 'bg-event-meeting',
    text: 'text-event-meeting',
    glow: 'shadow-[0_0_20px_-5px_hsl(var(--event-meeting)/0.3)]',
  },
  task: {
    bg: 'bg-event-task/10',
    border: 'border-event-task/20',
    accent: 'bg-event-task',
    text: 'text-event-task',
    glow: 'shadow-[0_0_20px_-5px_hsl(var(--event-task)/0.3)]',
  },
  reminder: {
    bg: 'bg-event-reminder/10',
    border: 'border-event-reminder/20',
    accent: 'bg-event-reminder',
    text: 'text-event-reminder',
    glow: 'shadow-[0_0_20px_-5px_hsl(var(--event-reminder)/0.3)]',
  },
  focus: {
    bg: 'bg-focus/10',
    border: 'border-focus/20',
    accent: 'bg-focus',
    text: 'text-focus',
    glow: 'shadow-[0_0_20px_-5px_hsl(var(--focus)/0.3)]',
  },
};

export function EventItem({ event, isSelected, onClick, compact }: EventItemProps) {
  const styles = eventTypeStyles[event.eventType];
  const duration = differenceInMinutes(event.endTime, event.startTime);
  const timeString = format(event.startTime, 'h:mm a');
  const endTimeString = format(event.endTime, 'h:mm a');

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 touch-target",
          styles.bg,
          "border",
          styles.border,
          "hover:shadow-soft",
          isSelected && "shadow-medium"
        )}
      >
        <div className={cn("w-1 h-8 rounded-full", styles.accent)} />
        <div className="flex-1 min-w-0">
          <span className={cn("text-sm font-medium truncate block", styles.text)}>
            {event.title}
          </span>
          <span className="text-xs text-muted-foreground">{timeString}</span>
        </div>
        {event.eventType === 'focus' && (
          <Zap className={cn("h-4 w-4", styles.text)} />
        )}
        {event.conferenceLink && (
          <Video className={cn("h-4 w-4", styles.text)} />
        )}
      </div>
    );
  }

  return (
    <article
      onClick={onClick}
      className={cn(
        "group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border touch-target",
        styles.bg,
        styles.border,
        "hover:shadow-soft",
        isSelected && cn("shadow-medium", styles.glow)
      )}
    >
      {/* Accent Bar */}
      <div className={cn("absolute left-0 top-5 bottom-5 w-1.5 rounded-r-full", styles.accent)} />

      <div className="pl-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-semibold text-lg truncate", styles.text)}>
              {event.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {timeString} – {endTimeString}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-muted/50 rounded-md">
                {duration}m
              </span>
            </div>
          </div>

          {event.eventType === 'focus' && (
            <div className={cn(
              "p-3 rounded-xl",
              styles.bg,
              "border",
              styles.border
            )}>
              <Zap className={cn("h-5 w-5", styles.text)} />
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {event.attendees.length > 0 && (
              <AvatarGroup people={event.attendees} max={4} />
            )}
            {event.location && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1.5 rounded-lg">
                <MapPin className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{event.location}</span>
              </span>
            )}
          </div>

          {event.conferenceLink && (
            <a
              href={event.conferenceLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                "bg-card border shadow-xs hover:shadow-soft",
                styles.text
              )}
            >
              <Video className="h-4 w-4" />
              Join Call
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
