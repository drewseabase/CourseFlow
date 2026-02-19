/**
 * WeekView Component
 * 
 * Displays a weekly calendar grid with:
 * - 8 columns: Time labels + 7 days (Sun-Sat)
 * - 24 rows: 12 AM - 11 PM (1-hour increments)
 * - Events positioned in their time slots
 * - Support for overlapping events (side-by-side)
 * - Scrollable container for full 24-hour view
 * - Today column highlighted
 */

import { useEffect, useRef } from 'react';
import { CalendarEvent } from '@/lib/mock/calendardatagenerator';
import CalendarEventCard from './calendarEvent';

interface WeekViewProps {
  weekStart: Date;           // Sunday of the current week
  events: CalendarEvent[];   // All events for this week
}

/**
 * Generate array of hours for time slots (0-23)
 */
const HOURS = Array.from({ length: 25 }, (_, i) => i);

/**
 * Format hour for display (e.g., "9 AM", "12 PM", "3 PM")
 */
function formatHour(hour: number): string {
  if (hour === 0 || hour === 24) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

/**
 * Check if a date is today
 */
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Get events for a specific day and hour
 */
function getEventsForSlot(
  day: Date,
  hour: number,
  events: CalendarEvent[]
): CalendarEvent[] {
  return events.filter(event => {
    const eventDay = event.startTime.getDate();
    const eventMonth = event.startTime.getMonth();
    const eventYear = event.startTime.getFullYear();
    const eventHour = event.startTime.getHours();
    
    return (
      eventDay === day.getDate() &&
      eventMonth === day.getMonth() &&
      eventYear === day.getFullYear() &&
      eventHour === hour
    );
  }).slice(0,2);
}

/**
 * Calculate event positioning within grid cell
 * Returns style object with position, height, and width for overlapping events
 */
function calculateEventStyle(
  event: CalendarEvent,
  slotEvents: CalendarEvent[],
  cellHeight: number
): React.CSSProperties {
  const eventIndex = slotEvents.indexOf(event);
  const totalEvents = slotEvents.length;
  
  // Calculate height based on duration
  const durationHours = event.duration / 60;
  const height = durationHours * cellHeight;
  
  // Calculate width and position for side-by-side display
  const width = totalEvents > 1 ? `${100 / totalEvents}%` : '100%';
  const left = totalEvents > 1 ? `${(eventIndex / totalEvents) * 100}%` : '0';
  
  return {
    position: 'absolute',
    top: 0,
    left,
    width,
    height: `${height}px`,
    zIndex: 10,
  };
}

/**
 * Derive a muted background, border, and text color from an event's color.
 * Handles both hex colors and Tailwind gradient class strings.
 */
function getMutedEventStyle(color: string): React.CSSProperties {
  // If it's a Tailwind gradient class string we can't use it inline —
  // fall back to a neutral violet tint
  if (color.startsWith('from-')) {
    return {
      backgroundColor: 'rgba(139,92,246,0.10)',
      border: '1.5px solid rgba(139,92,246,0.28)',
      color: '#6d28d9',
    };
  }

  // Parse hex → RGB so we can build rgba values
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return {
    backgroundColor: `rgba(${r},${g},${b},0.10)`,
    border: `1.5px solid rgba(${r},${g},${b},0.28)`,
    color: color,
  };
}

export default function WeekView({ weekStart, events }: WeekViewProps) {
  // Generate array of 7 days starting from Sunday
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Height of each hour cell in pixels
  const CELL_HEIGHT = 35;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const currentHour = new Date().getHours();
    scrollRef.current.scrollTop = currentHour * CELL_HEIGHT;
  }, []);

  // Option A surface token
  const panel =
    'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';
  
  return (
    <div className={`p-7 ${panel}`}>
      {/* Scrollable container for 24-hour view */}
      <div
        ref={scrollRef}
        className="overflow-auto max-h-120 rounded-xl border border-[#E4E4E7]"
      >
        {/* Calendar Grid */}
        <div className="grid w-full gap-0" style={{ gridTemplateColumns: '80px repeat(7, minmax(120px, 1fr))' }}>
          
          {/* HEADER ROW */}
          {/* Time column header */}
          <div className="bg-[#FAFAFA] p-4 text-[11px] font-bold uppercase tracking-wide text-[#A1A1AA] sticky top-0 z-20 border-b border-r border-[#E4E4E7]">
            Time
          </div>
          
          {/* Day headers */}
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                bg-[#FAFAFA] p-4 text-center sticky top-0 z-20 border-b border-[#E4E4E7]
                ${isToday(day) ? 'bg-linear-to-br from-[#667eea] to-[#764ba2]' : ''}
                ${index < 6 ? 'border-r' : ''}
              `}
            >
              <div className={`text-[11px] font-bold uppercase tracking-wide mb-1 ${isToday(day) ? 'text-white' : 'text-[#A1A1AA]'}`}>
                {dayNames[index]}
              </div>
              <div className={`text-[15px] font-bold ${isToday(day) ? 'text-white' : 'text-[#18181B]'}`}>
                {day.getDate()}
              </div>
            </div>
          ))}
          
          {/* TIME SLOT ROWS */}
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              {/* Time label */}
              <div
                className="bg-[#FAFAFA] p-3 text-[11px] font-semibold text-[#A1A1AA] text-center border-r border-[#E4E4E7]"
                style={{ height: `${CELL_HEIGHT}px` }}
              >
                {formatHour(hour)}
              </div>
              
              {/* Day cells */}
              {days.map((day, dayIndex) => {
                const slotEvents = getEventsForSlot(day, hour, events);
                
                return (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className={`
                      bg-white relative
                      ${dayIndex < 6 ? 'border-r' : ''}
                      border-b border-[#E4E4E7]
                    `}
                    style={{ minHeight: `${CELL_HEIGHT}px`, height: `${CELL_HEIGHT}px` }}
                  >
                    {/* Render events in this slot */}
                    {slotEvents.map((event) => {
                      const eventStyle = calculateEventStyle(event, slotEvents, CELL_HEIGHT);
                      const mutedStyle = getMutedEventStyle(event.color);

                      return (
                        <div
                          key={event.id}
                          style={{
                            ...eventStyle,
                            ...mutedStyle,
                            borderRadius: '6px',
                            padding: '3px 6px',
                            fontSize: '10px',
                            fontWeight: 700,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          {/* Small color dot */}
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '2px',
                              backgroundColor: event.color.startsWith('from-') ? '#8B5CF6' : event.color,
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {event.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

