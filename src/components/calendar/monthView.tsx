/**
 * MonthView Component
 * 
 * Displays a monthly calendar grid similar to the dashboard calendar:
 * - 7 columns (Sun-Sat)
 * - 5-6 rows for weeks
 * - Colored dots for events (up to 3 dots, then "3+ events")
 * - Click handler to open modal with day's events
 * - Highlights today and selected date
 */

import { CalendarEvent } from "@/lib/mock/calendardatagenerator";

interface MonthViewProps {
  monthStart: Date;                         // First day of the month
  events: CalendarEvent[];                  // All events for the month
  selectedDate: Date | null;                // Currently selected date (for modal)
  onDayClick: (date: Date) => void;        // Handler for day click
}

/**
 * Get the number of days in a month
 */
function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of week the month starts on (0 = Sunday)
 */
function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Check if a date is today
 */
function isToday(day: number, month: number, year: number): boolean {
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
}

/**
 * Check if a date is selected
 */
function isSelected(day: number, month: number, year: number, selectedDate: Date | null): boolean {
  if (!selectedDate) return false;
  return (
    day === selectedDate.getDate() &&
    month === selectedDate.getMonth() &&
    year === selectedDate.getFullYear()
  );
}

/**
 * Get events for a specific day
 */
function getEventsForDay(day: number, month: number, year: number, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = event.startTime;
    return (
      eventDate.getDate() === day &&
      eventDate.getMonth() === month &&
      eventDate.getFullYear() === year
    );
  });
}

/**
 * Get unique colors from events (for dots)
 * Returns up to 3 unique colors
 */
function getEventColors(dayEvents: CalendarEvent[]): string[] {
  const colors: string[] = [];
  
  dayEvents.forEach(event => {
    // Skip if we already have 3 colors
    if (colors.length >= 3) return;
    
    // Use the event's color
    const color = event.color;
    
    // Add if not already in array
    if (!colors.includes(color)) {
      colors.push(color);
    }
  });
  
  return colors;
}

/**
 * Render event dot
 */
function EventDot({ color, isSelectedDay }: { color: string; isSelectedDay: boolean }) {
  // Check if it's a gradient class
  const isGradient = color.startsWith('from-');
  
  if (isGradient) {
    return (
      <div className={`w-1 h-1 rounded-full bg-linear-to-br ${color}`}></div>
    );
  } else {
    return (
      <div
        className={`w-1 h-1 rounded-full ${isSelectedDay ? 'bg-white' : ''}`}
        style={!isSelectedDay ? { backgroundColor: color } : {}}
      ></div>
    );
  }
}

export default function MonthView({ monthStart, events, selectedDate, onDayClick }: MonthViewProps) {
  const month = monthStart.getMonth();
  const year = monthStart.getFullYear();
  
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  
  // Generate calendar days
  const calendarDays: Array<{ day: number | null; isEmpty: boolean }> = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ day: null, isEmpty: true });
  }
  
  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, isEmpty: false });
  }
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const panel =
    'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';
  
  return (
    <div className={`p-7 ${panel}`}>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="text-center text-xs font-bold text-black py-3 uppercase"
          >
            {dayName}
          </div>
        ))}
        
        {/* Calendar Day Cells */}
        {calendarDays.map((dayObj, index) => {
          // Empty cell
          if (dayObj.isEmpty) {
            return (
              <div
                key={`empty-${index}`}
                className="aspect-square"
              />
            );
          }
          
          const day = dayObj.day!;
          const isTodayDate = isToday(day, month, year);
          const isSelectedDate = isSelected(day, month, year, selectedDate);
          const dayEvents = getEventsForDay(day, month, year, events);
          const eventColors = getEventColors(dayEvents);
          const hasEvents = dayEvents.length > 0;
          
          return (
            <div
              key={`day-${day}`}
              onClick={() => {
                const clickedDate = new Date(year, month, day);
                onDayClick(clickedDate);
              }}
              className={`
                aspect-square rounded-[14px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative
                ${isSelectedDate
                  ? 'bg-linear-to-br from-[#667eea] to-[#764ba2] text-white font-bold'
                  : isTodayDate
                    ? 'bg-[#FAFAFA] hover:scale-105 hover:bg-[#E4E4E7] border-2 border-[#667eea]'
                    : 'bg-[#FAFAFA] hover:scale-105 hover:bg-[#E4E4E7]'
                }
              `}
            >
              {/* Day Number */}
              <div className="text-base font-semibold">
                {day}
              </div>
              
              {/* Event Indicator Dots */}
              {hasEvents && (
                <div className="absolute bottom-1.5 flex gap-0.5">
                  {eventColors.map((color, idx) => (
                    <EventDot key={idx} color={color} isSelectedDay={isSelectedDate} />
                  ))}
                  
                  {/* Show "+N" if more than 3 events */}
                  {dayEvents.length > 3 && (
                    <div className={`text-[8px] font-bold ml-0.5 ${isSelectedDate ? 'text-white' : 'text-[#8B5CF6]'}`}>
                      +{dayEvents.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
