import { Star, Paperclip, MessageSquare, Link2, ChevronRight } from 'lucide-react';
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
        "group relative flex gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 touch-target",
        "border border-transparent",
        isSelected 
          ? "bg-card shadow-medium border-border/50" 
          : "hover:bg-card/60 hover:shadow-soft hover:border-border/30",
        !email.isRead && "bg-card shadow-soft border-border/30"
      )}
    >
      {/* Priority Indicator */}
      {(email.priority === 'urgent' || email.priority === 'high') && (
        <div className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full transition-all duration-300",
          email.priority === 'urgent' ? "bg-destructive" : "bg-accent"
        )} />
      )}

      {/* Avatar */}
      <Avatar person={email.from} size="md" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={cn(
            "font-medium truncate text-foreground",
            !email.isRead && "font-semibold"
          )}>
            {email.from.name}
          </span>
          
          {/* Labels */}
          <div className="hidden sm:flex items-center gap-1.5">
            {email.labels.slice(0, 2).map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted/60 text-muted-foreground border border-border/30"
              >
                {label}
              </span>
            ))}
          </div>

          <span className="ml-auto text-xs text-muted-foreground shrink-0 font-medium">
            {timeAgo}
          </span>
        </div>

        {/* Subject */}
        <h3 className={cn(
          "text-sm mb-1.5 truncate",
          !email.isRead ? "font-semibold text-foreground" : "text-foreground/90"
        )}>
          {email.subject}
        </h3>

        {/* Snippet */}
        <p className="text-sm text-muted-foreground line-clamp-1">
          {email.snippet}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-4 mt-3 text-muted-foreground">
          {email.hasAttachment && (
            <span className="flex items-center gap-1.5 text-xs bg-muted/40 px-2 py-1 rounded-md">
              <Paperclip className="h-3 w-3" />
              <span className="hidden sm:inline">Attachment</span>
            </span>
          )}
          {email.replyCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs">
              <MessageSquare className="h-3 w-3" />
              {email.replyCount}
            </span>
          )}
          {email.linkedEvent && (
            <span className="flex items-center gap-1.5 text-xs text-event-meeting">
              <Link2 className="h-3 w-3" />
              <span className="hidden sm:inline">Event linked</span>
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "p-2 rounded-xl transition-all duration-200",
            email.isStarred 
              ? "text-accent bg-accent/10" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Star className={cn("h-4 w-4", email.isStarred && "fill-current")} />
        </button>
      </div>

      {/* Mobile arrow indicator */}
      <ChevronRight className="h-5 w-5 text-muted-foreground/30 shrink-0 self-center lg:hidden" />
    </article>
  );
}
