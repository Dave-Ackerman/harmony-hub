import { Video, MapPin, Clock, Zap } from 'lucide-react';
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
    border: 'border-event-meeting/30',
    accent: 'bg-event-meeting',
    text: 'text-event-meeting',
  },
  task: {
    bg: 'bg-event-task/10',
    border: 'border-event-task/30',
    accent: 'bg-event-task',
    text: 'text-event-task',
  },
  reminder: {
    bg: 'bg-event-reminder/10',
    border: 'border-event-reminder/30',
    accent: 'bg-event-reminder',
    text: 'text-event-reminder',
  },
  focus: {
    bg: 'bg-focus/10',
    border: 'border-focus/30',
    accent: 'bg-focus',
    text: 'text-focus',
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
          "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200",
          styles.bg,
          styles.border,
          "border",
          isSelected && "shadow-medium"
        )}
      >
        <div className={cn("w-1 h-6 rounded-full", styles.accent)} />
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
        "group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border",
        styles.bg,
        styles.border,
        isSelected && "shadow-medium"
      )}
    >
      {/* Accent Bar */}
      <div className={cn("absolute left-0 top-4 bottom-4 w-1 rounded-r-full", styles.accent)} />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className={cn("font-medium", styles.text)}>
              {event.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeString} – {endTimeString}</span>
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {duration}m
              </span>
            </div>
          </div>

          {event.eventType === 'focus' && (
            <div className={cn(
              "p-2 rounded-lg",
              styles.bg
            )}>
              <Zap className={cn("h-5 w-5", styles.text)} />
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {event.attendees.length > 0 && (
              <AvatarGroup people={event.attendees} max={4} />
            )}
            {event.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {event.location}
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
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                styles.bg,
                styles.text,
                "hover:opacity-80"
              )}
            >
              <Video className="h-3.5 w-3.5" />
              Join
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
