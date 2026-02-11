/**
 * CalendarEvent Component
 * 
 * Reusable event card component that displays calendar events.
 * 
 * Adapts its appearance based on:
 * - Event Type
 * - View Type
 * 
 * Visual styles:
 * - Classes: solid color background w/ border
 * - Work: Gold-to-black gradient
 * - Personal: Blue-To-blacj gradient
 * - Tasks: gradient background with left accent border
 */

import { CalendarEvent } from "@/lib/mock/calendardatagenerator";

interface CalendarEventProps{
    event: CalendarEvent;
    viewType: 'day' | 'week' | 'month';
    style?: React.CSSProperties;
}

/**
 * Format time to 12-hour format
 */
function formatTime(date: Date): string{
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes = minutes.toString().padStart(2,'0');
    return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Format time range
 */
function formatTimeRange(start: Date, end: Date): string{
    const startHours = start.getHours();
    const endHours = end.getHours();
    const startMinutes = start.getMinutes();
    const endMinutes = end.getMinutes();

    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
    const startPeriod = startHours >= 12 ? 'PM' : 'AM';

    const displayStartHours = startHours === 0 ? 12 : startHours > 12 ? startHours - 12 : startHours;
    const displayEndHours = endHours === 0 ? 12 : endHours > 12 ? endHours - 12 : endHours;

    const displayStartMinutes = startMinutes.toString().padStart(2,'0');
    const displayEndMinutes = endMinutes.toString().padStart(2,'0');

    //If same period, only show period once at the end

    if(startPeriod === endPeriod){
        return `${displayStartHours}:${displayStartMinutes} - ${displayEndHours}:${displayEndMinutes}${endPeriod}`;
    }else {
        return `${displayStartHours}:${displayStartMinutes} ${startPeriod} - ${displayEndHours}:${displayEndMinutes} ${endPeriod}`;
    }
}

export default function CalendarEventCard({event, viewType, style}: CalendarEventProps){
    /**
     * Determine the CSS classes for the event card based on type
     */
    const getEventClasses = () => {
        const baseClasses = 'rounded-lg cursor-pointer transition-all duration-200 overflow-hidden';

        //Different styles for different event types
       if(event.type === 'class'){
        return `${baseClasses} border-none border-opacity-50`;
       }else if(event.type === 'work'){
        return `${baseClasses} bg-gradient-to-br ${event.color}`;
       }else if (event.type === 'personal'){
        return `${baseClasses} bg-gradient-to-br ${event.color}`;
       }else if (event.type === 'task'){
        return `${baseClasses} bg-gradient-to-br ${event.gradientClass} relative`;
       }

       return baseClasses;
    };

    /**
     * Get background color style for class events (solid color)
     */
    const getBackgroundStyle = () => {
        if (event.type === 'class'){
            return {
                backgroundColor: event.color,
                borderColor: event.color,
            };
        }

        return {};
    };

    /**
     * Render for WEEK view (compact, fits in grid cell)
     */
    if (viewType === 'week'){
        return (
            <div className={`${getEventClasses()} p-2 mb-1 hover:scale-105`} style={{...style, ...getBackgroundStyle()}}>
                {/*Left accent bar for tasks*/}
                {event.type === 'task' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-50"></div>
                )}

                {/*Time*/}
                <div className="text-[10px] font-bold text-white uppercase tracking-wide mb-1 opacity-90">
                    {formatTime(event.startTime)}
                </div>

                {/*Title*/}
                <div className="text-[11px] font-semibold text-white mb-0.5 line-clamp-2">
                    {event.title}
                </div>

                {/*Course name (if applicable*/}
                {event.course && (
                    <div className="text-[9px] text-white opacity-80">
                        {event.course}
                    </div>
                )}
            </div>
        );
    }

    /**
     * Render for DAY view (larger, more details)
     */
    if (viewType === 'day'){
        return (
            <div className={`${getEventClasses()} p-4 mb-2 hover:-translate-y-1 hover:shadow-lg`} style={{...style, ...getBackgroundStyle()}}>
                
                {/*Left accent bar for tasks*/}
                {event.type === 'task' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-50"></div>
                )}

                {/*Time Range*/}
                <div className="text-xs font-bold text-white uppercase tracking-wide mb-2 opacity-90">
                    {formatTimeRange(event.startTime, event.endTime)}
                </div>

                {/*Title*/}
                <div className="text-base font-semibold text-white mb-1">
                    {event.title}
                </div>

                {/*Course Name*/}
                {event.course && (
                    <div className="text-sm text-white opacity-80 mb-2">
                        {event.course}
                    </div>
                )}

                {/*Duration*/}
                <div className="text-xs text-white opacity-70">
                    {event.duration} minutes
                </div>

                {/*Event type badge*/}
                <div className="mt-2 inline-block px-2 py-1 bg-white bg-opacity-20 rounded text-[10px] font-semibold text-white uppercase tracking-wide">
                    {event.type}
                </div>
            </div>
        );
    }

    //Month view doesnt render individual event cards just dots
    //This component shouldnt be called for month view

    return null;

}