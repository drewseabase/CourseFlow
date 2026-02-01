/**
 * DayColumn Component
 * 
 * Represents a single day column in the calendar week view
 * Displays:
 * - Day header(name and date)
 * - Time slot grid lines
 * - Event blocks positioned within the day
 * - Selection highlight if this day is selected for Today view
 */
"use client";
import React from "react";
import { FixedEvent, ScheduleBlock } from "@/types/schedule";
import { EventBlock } from "./event-block";
import { formatShortDayName, formatMonthDay, isSameDay } from "@/lib/utils/date-helpers";
import { timeToGridRow, calculateGridHeight } from "@/lib/utils/time";
import {useDragDrop} from "@/hooks/use-drag-drop";

/**
 * Props for DayColumn component
 */
interface DayColumnProps{
    date: Date;                         // The date this column represents
    fixedEvents: FixedEvent[];          // Fixed events on this day
    scheduleBlocks: ScheduleBlock[];    // Study blocks on this day
    isSelected: boolean;                // Whether this day is selected for Today view
    onDayClick: (date: Date) => void;   // Callback when day header is clicked
}

/**
 * DayColumn component
 * 
 * Renders a single day column with:
 * - Header showing day name and date
 * - Grid lines for time slots
 * - All events/blocks positioned absolutely based on their times
 * 
 * @param props - Components props
 * @returns Rendered day column
 */
export function DayColumn({
    date,
    fixedEvents,
    scheduleBlocks, 
    isSelected,
    onDayClick,
}: DayColumnProps){
    //Combine all events for rendering
    const allEvents = [...fixedEvents, ...scheduleBlocks];

    //get drag-drop handlers
    const {handleDragStart, handleDragEnd, handleDragOver, handleDrop} = useDragDrop();

    //Generate grid lines for each hour (24 hours)
    const hours = Array.from({length: 24} , (_, i) => i);

    //Wrap handleDrop with date
    const handleDropOnDay = (e: React.DragEvent) =>{
        handleDrop(date, e);
    };

    return(
        <div className="flex-1 min-w-0 border-r border-gray-200 relative">
            {/* Day header */}
            <div className={`h-16 border-b border-gray-200 flex flex-col items-center justify-center
             cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? "bg-indigo-50 border-indigo-300" : "bg-white"}`}
             onClick = {() => onDayClick(date)}>
                <div className="text-xs font-semibold text-gray-700">
                    {formatShortDayName(date)}
                </div>
                <div className={`text-sm font-bold ${isSelected ? "text-indigo-600" : "text-gray-900"}`}>
                    {formatMonthDay(date)}
                </div>
             </div>

             {/* Grid container for time slots */}
             <div className="relative" onDragOver = {handleDragOver} onDrop = {handleDropOnDay}>
                {/* Grid lines (background) */}
                {hours.map((hour) =>
                <div key={hour} className="border-b border-gray-100" style={{height: "64px"}}/>
            )}
            {/* Event blocks (absolutely positioned) */}
            <div className="absolute inset-0 pointer-events-none">
                {allEvents.map((event) =>{
                    //Calculate position and height based on event time
                    const startRow = timeToGridRow(event.startAt);
                    const heightRows = calculateGridHeight(event.startAt, event.endAt);

                    //Each row is 16px
                    const top = startRow * 16;
                    const height = heightRows * 16;

                    //Only render if event is on this day
                    if(!isSameDay(event.startAt, date)){
                        return null;
                    }

                    return (
                        <div key={event.id} className="pointer-events-auto">
                            <EventBlock
                                event={event}
                                style={{
                                    top: `${top}px`,
                                    height: `${height}px`,
                                    left: "4px",
                                    right: "4px",
                                }}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                />
                            </div>
                        );
                    })}
                </div>
             </div>
        </div>
    );
}