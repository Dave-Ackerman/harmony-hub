import { useState } from 'react';
import { CalendarEvent } from '@/types/flowstate';
import { MiniCalendar } from '@/components/calendar/MiniCalendar';
import { UpcomingEvents } from '@/components/calendar/UpcomingEvents';
import { Zap, CheckCircle2, Circle, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = (completedCount / tasks.length) * 100;

  return (
    <aside className="hidden lg:flex flex-col w-80 xl:w-96 border-l bg-background/50 backdrop-blur-sm p-4 xl:p-6 space-y-5 overflow-y-auto scrollbar-thin">
      {/* Focus Mode Banner */}
      {focusMode && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-focus/15 to-focus/5 border border-focus/20 shadow-soft animate-slide-in-right">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-focus/20 shadow-inner">
              <Zap className="h-6 w-6 text-focus" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-focus text-lg">Focus Mode</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Showing priority items only
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-focus/50 animate-float" />
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
      <div className="p-5 bg-card rounded-2xl border shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Quick Tasks
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedCount} of {tasks.length} done
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" className="rounded-xl">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-success to-success/70 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="space-y-1">
          {tasks.map((task, index) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 touch-target",
                "hover:bg-secondary/50",
                task.completed && "opacity-60",
                "animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative">
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 animate-scale-in" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
              </div>
              <span className={cn(
                "text-sm flex-1 transition-all duration-300",
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
