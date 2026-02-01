import { cn } from '@/lib/utils';
import { Person } from '@/types/flowstate';

interface AvatarProps {
  person: Person;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
};

const colors = [
  'bg-accent/20 text-accent',
  'bg-focus/20 text-focus',
  'bg-success/20 text-success',
  'bg-event-meeting/20 text-event-meeting',
  'bg-event-task/20 text-event-task',
  'bg-event-reminder/20 text-event-reminder',
];

function getColorForPerson(person: Person): string {
  const index = person.id.charCodeAt(0) % colors.length;
  return colors[index];
}

export function Avatar({ person, size = 'md', showStatus, className }: AvatarProps) {
  const colorClass = getColorForPerson(person);
  
  return (
    <div className={cn("relative shrink-0", className)}>
      {person.avatar ? (
        <img
          src={person.avatar}
          alt={person.name}
          className={cn(
            "rounded-full object-cover ring-2 ring-background",
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-medium ring-2 ring-background",
            sizeClasses[size],
            colorClass
          )}
        >
          {person.initials}
        </div>
      )}
      {showStatus && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
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
    <div className="flex -space-x-2">
      {displayed.map((person) => (
        <Avatar key={person.id} person={person} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-medium bg-muted text-muted-foreground ring-2 ring-background",
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
