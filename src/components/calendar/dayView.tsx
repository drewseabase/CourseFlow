/**
 * DayView Component
 * 
 * Displays a single day with:
 * - 24 hr time slots
 * - Larger, more detailed event cards
 * - Scrollable container
 * - Events positioned by time with appropriate height based on duration
 */

import { CalendarEvent } from "@/lib/mock/calendardatagenerator";

interface DayViewProps {
    date: Date;
    events: CalendarEvent[];
}

/**
 * Generate array of hours for time slots
 */
const HOURS = Array.from({length: 25}, (_,i) => i);

/*Format hour for display */
function formatHour(hour: number): string{
    if(hour === 0 || hour === 24) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`
}

/**
 * Get events that start in a specific hour
 */
function getEventsForHour(hour: number, events: CalendarEvent[]): CalendarEvent[]{
    return events.filter(event => event.startTime.getHours() === hour);
}

/**
 * Calculate event positioning and height
 */
function calculateEventStyle(
    event: CalendarEvent,
    hourEvents: CalendarEvent[],
    cellHeight: number
): React.CSSProperties{
    const eventIndex = hourEvents.indexOf(event);
    const totalEvents = hourEvents.length;

    const durationHours = event.duration / 60;
    const height = durationHours * cellHeight;

    const width = totalEvents > 1 ? `${100 / totalEvents}%` : '100%';
    const left = totalEvents > 1 ? `${(eventIndex / totalEvents) * 100}%`: '0';

    return{
        position: 'absolute',
        top: 0,
        left,
        width,
        height: `${height}px`,
        zIndex: 10,
    };
}

/**
 * Derive a darker muted background, border, and text color from an event's color.
 * More opaque than WeekView since day view cards are larger.
 */
function getMutedEventStyle(color: string): React.CSSProperties {
    if (color.startsWith('from-')) {
        return {
            backgroundColor: 'rgba(139,92,246,0.22)',
            border: '1.5px solid rgba(139,92,246,0.45)',
            color: '#5b21b6',
        };
    }

    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return {
        backgroundColor: `rgba(${r},${g},${b},0.22)`,
        border: `1.5px solid rgba(${r},${g},${b},0.45)`,
        color: color,
    };
}

const CalendarEmptyIcon = () => (
    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export default function DayView({date, events}: DayViewProps){
    const CELL_HEIGHT = 70;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const dayNumber = date.getDate();

    const panel =
        'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';

    return(
        <div className={`p-7 ${panel}`}>
            {/*Day Header*/}
            <div className="mb-6 pb-6 border-b border-[#E4E4E7]">
                <div className="text-[25px] font-bold uppercase tracking-wide text-black mb-2">
                    {dayName}
                </div>
                <div className="text-[14px] font-bold text-[#18181B] mb-2">
                    {monthName} {dayNumber}
                </div>
                <div className="text-[13px] text-black mt-1">
                    {events.length} {events.length === 1 ? 'event' : 'events'} scheduled
                </div>
            </div>

            {/*Scrollable Container for 24-hour view*/}
            <div className="overflow-auto max-h-100 rounded-xl border border-stone-400/70">
                {/*Time slot grid*/}
                <div className="grid w-full" style={{gridTemplateColumns: '80px 1fr'}}>
                    {HOURS.map((hour) => {
                        const hourEvents = getEventsForHour(hour, events);

                        return(
                            <div key={hour} className="contents">
                                {/*Time label*/}
                                <div
                                    className="bg-[#FAFAFA] p-3 text-[11px] font-semibold text-[#A1A1AA] text-center border-r border-b border-[#E4E4E7]"
                                    style={{height: `${CELL_HEIGHT}px`}}
                                >
                                    {formatHour(hour)}
                                </div>

                                {/*Event Cell*/}
                                <div
                                    className="bg-white relative border-b border-[#E4E4E7] px-2"
                                    style={{minHeight: `${CELL_HEIGHT}px`, height: `${CELL_HEIGHT}px`}}
                                >
                                    {hourEvents.map((event) => {
                                        const posStyle = calculateEventStyle(event, hourEvents, CELL_HEIGHT);
                                        const mutedStyle = getMutedEventStyle(event.color);

                                        return (
                                            <div
                                                key={event.id}
                                                style={{
                                                    ...posStyle,
                                                    ...mutedStyle,
                                                    borderRadius: '8px',
                                                    padding: '6px 10px',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '3px',
                                                }}
                                            >
                                                {/* Top row: dot + title */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span
                                                        style={{
                                                            width: '7px',
                                                            height: '7px',
                                                            borderRadius: '2px',
                                                            backgroundColor: event.color.startsWith('from-') ? '#8B5CF6' : event.color,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <span style={{
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        {event.title}
                                                    </span>
                                                </div>

                                                {/* Time row — only shown if cell is tall enough */}
                                                {event.duration >= 60 && (
                                                    <span style={{
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        opacity: 0.70,
                                                        paddingLeft: '13px',
                                                    }}>
                                                        {event.startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                                        {' — '}
                                                        {event.endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/*Empty state if no events*/}
            {events.length === 0 && (
                <div className="text-center py-12 text-zinc-400">
                    <CalendarEmptyIcon />
                    <div className="text-[18px] font-semibold text-[#18181B] mb-2">
                        No Events Today
                    </div>
                    <div className="text-[14px] text-[#52525B]">
                        Enjoy your free time!
                    </div>
                </div>
            )}
        </div>
    );
}
