import { useState } from 'react';
import { CalendarEvent } from '@/types/flowstate';
import { MiniCalendar } from '@/components/calendar/MiniCalendar';
import { UpcomingEvents } from '@/components/calendar/UpcomingEvents';
import { Zap, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextPanelProps {
  events: CalendarEvent[];
  focusMode: boolean;
}

interface QuickTask {
  id: string;
  text: string;
  completed: boolean;
}

export function ContextPanel({ events, focusMode }: ContextPanelProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<QuickTask[]>([
    { id: '1', text: 'Review roadmap doc', completed: false },
    { id: '2', text: 'Send client update', completed: true },
    { id: '3', text: 'Prepare for design review', completed: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <aside className="w-80 border-l bg-background p-4 space-y-4 overflow-y-auto scrollbar-thin">
      {/* Focus Mode Banner */}
      {focusMode && (
        <div className="p-4 rounded-xl bg-focus/10 border border-focus/20 animate-slide-in-right">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-focus/20">
              <Zap className="h-5 w-5 text-focus" />
            </div>
            <div>
              <h3 className="font-medium text-focus">Focus Mode</h3>
              <p className="text-xs text-muted-foreground">
                Only priority items shown
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mini Calendar */}
      <MiniCalendar
        events={events}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Upcoming Events */}
      <UpcomingEvents events={events} />

      {/* Quick Tasks */}
      <div className="p-4 bg-card rounded-xl border shadow-soft">
        <h3 className="font-display font-medium text-foreground mb-4">
          Quick Tasks
        </h3>
        <div className="space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all duration-200",
                "hover:bg-secondary/50",
                task.completed && "opacity-60"
              )}
            >
              {task.completed ? (
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className={cn(
                "text-sm",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
