import { cn } from '@/lib/utils';
import { Person } from '@/types/flowstate';

interface AvatarProps {
  person: Person;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
};

const gradients = [
  'from-accent/30 to-accent/10 text-accent',
  'from-focus/30 to-focus/10 text-focus',
  'from-success/30 to-success/10 text-success',
  'from-event-meeting/30 to-event-meeting/10 text-event-meeting',
  'from-event-task/30 to-event-task/10 text-event-task',
  'from-event-reminder/30 to-event-reminder/10 text-event-reminder',
];

function getGradientForPerson(person: Person): string {
  const index = person.id.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export function Avatar({ person, size = 'md', showStatus, className }: AvatarProps) {
  const gradientClass = getGradientForPerson(person);
  
  return (
    <div className={cn("relative shrink-0", className)}>
      {person.avatar ? (
        <img
          src={person.avatar}
          alt={person.name}
          className={cn(
            "rounded-xl object-cover ring-2 ring-background shadow-xs",
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-xl flex items-center justify-center font-semibold ring-2 ring-background bg-gradient-to-br shadow-xs",
            sizeClasses[size],
            gradientClass
          )}
        >
          {person.initials}
        </div>
      )}
      {showStatus && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-background shadow-xs" />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  people: Person[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ people, max = 3, size = 'sm' }: AvatarGroupProps) {
  const displayed = people.slice(0, max);
  const remaining = people.length - max;

  return (
    <div className="flex -space-x-2.5">
      {displayed.map((person) => (
        <Avatar key={person.id} person={person} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "rounded-xl flex items-center justify-center font-semibold bg-muted text-muted-foreground ring-2 ring-background shadow-xs",
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
