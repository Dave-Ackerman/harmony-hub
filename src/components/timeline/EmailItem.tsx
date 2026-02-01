import { Star, Paperclip, MessageSquare, Link2 } from 'lucide-react';
import { EmailThread } from '@/types/flowstate';
import { Avatar } from '@/components/shared/Avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface EmailItemProps {
  email: EmailThread;
  isSelected?: boolean;
  onClick?: () => void;
}

export function EmailItem({ email, isSelected, onClick }: EmailItemProps) {
  const timeAgo = formatDistanceToNow(email.timestamp, { addSuffix: true });

  return (
    <article
      onClick={onClick}
      className={cn(
        "group relative flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200",
        isSelected 
          ? "bg-secondary shadow-medium" 
          : "hover:bg-secondary/50",
        !email.isRead && "bg-card shadow-soft"
      )}
    >
      {/* Priority Indicator */}
      {email.priority === 'urgent' && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-destructive" />
      )}
      {email.priority === 'high' && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-accent" />
      )}

      {/* Avatar */}
      <Avatar person={email.from} size="md" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "font-medium truncate",
            !email.isRead && "font-semibold"
          )}>
            {email.from.name}
          </span>
          
          {/* Labels */}
          {email.labels.slice(0, 2).map((label) => (
            <span
              key={label}
              className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground"
            >
              {label}
            </span>
          ))}

          <span className="ml-auto text-xs text-muted-foreground shrink-0">
            {timeAgo}
          </span>
        </div>

        {/* Subject */}
        <h3 className={cn(
          "text-sm mb-1 truncate",
          !email.isRead ? "font-semibold text-foreground" : "text-foreground/90"
        )}>
          {email.subject}
        </h3>

        {/* Snippet */}
        <p className="text-sm text-muted-foreground line-clamp-1">
          {email.snippet}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-2 text-muted-foreground">
          {email.hasAttachment && (
            <span className="flex items-center gap-1 text-xs">
              <Paperclip className="h-3 w-3" />
            </span>
          )}
          {email.replyCount > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <MessageSquare className="h-3 w-3" />
              {email.replyCount}
            </span>
          )}
          {email.linkedEvent && (
            <span className="flex items-center gap-1 text-xs text-event-meeting">
              <Link2 className="h-3 w-3" />
              Event linked
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            email.isStarred 
              ? "text-accent" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Star className={cn("h-4 w-4", email.isStarred && "fill-current")} />
        </button>
      </div>
    </article>
  );
}
