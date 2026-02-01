import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '@/types/flowstate';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MiniCalendarProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MiniCalendar({ events, selectedDate, onSelectDate }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const hasEvents = (date: Date) => {
    return events.some((event) => isSameDay(event.startTime, date));
  };

  return (
    <div className="p-4 bg-card rounded-xl border shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-medium text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const dayHasEvents = hasEvents(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative h-8 w-8 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !isCurrentMonth && "text-muted-foreground/40",
                isCurrentMonth && "text-foreground",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                isTodayDate && !isSelected && "bg-accent/20 text-accent font-semibold"
              )}
            >
              {format(day, 'd')}
              {dayHasEvents && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-event-meeting" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
