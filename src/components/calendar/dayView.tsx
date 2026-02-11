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
import CalendarEventCard from "./calendarEvent";

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
 * Get events that start in a specifc hour
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

    //Calculate height based on duratioin
    const durationHours = event.duration / 60;
    const height = durationHours * cellHeight;

    //Calculate width and position for side-by-side display if multiple events
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

export default function DayView({date, events}: DayViewProps){
    const CELL_HEIGHT = 100;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const dayNumber = date.getDate();

    return(
        <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            {/*Day Header*/}
            <div className="mb-6 pb-6 border-b border-[#E4E4E7]">
                <div className="text-[35px] font-bold uppercase tracking-wide text-[#A1A1AA]. mb-2">
                    {dayName}
                </div>
                <div className="text-[25px] font-bold text-[#18181B] mb-2">
                    {monthName} {dayNumber}
                </div>
                <div className="text-[15px] text-[#52525B] mt-1">
                    {events.length} {events.length === 1 ? 'event' : 'events'} scheduled
                </div>
            </div>

            {/*Scrollable Container for 24-hour view*/}
            <div className="overflow-auto max-h-150 rounded-xl border border-[#E4E4E7]">
                {/*Time slot grid*/}
                <div className="grid w-full" style={{gridTemplateColumns: '80px 1fr'}}>
                    {/*Time Slot Rows*/}
                    {HOURS.map((hour) => {
                        const hourEvents = getEventsForHour(hour, events);

                        return(
                            <div key={hour} className="contents">
                                {/*Time label*/}
                                <div className="bg-[#FAFAFA] p-3 text-[11px] font-semibold text-[#A1A1AA] text-center border-r border-b border-[#E4E4E7]" style={{height: `${CELL_HEIGHT}px`}}>
                                    {formatHour(hour)}
                                </div>

                                {/*Event Cell*/}
                                <div className="bg-white relative border-b border-[#E4E4E7] px-4" style={{minHeight: `${CELL_HEIGHT}px`, height: `${CELL_HEIGHT}px`}}>
                                    {/*Render events in this hour*/}
                                    {hourEvents.map((event) =>(
                                        <CalendarEventCard key={event.id} event={event} viewType="day" style={calculateEventStyle(event, hourEvents, CELL_HEIGHT)}/>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/*Empty state if no events*/}
            {events.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-[48px] mb-4">
                        📅
                    </div>
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