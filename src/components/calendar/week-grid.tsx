/**
 * WeekGrid Component
 * 
 * Main calendar grid displaying a full week view
 * This is the desktop version showing all 7 days side by side
 * 
 * Layout:
 * - Left column: Time labels
 * - 7 day columns: One for each day of the week
 * - Scrollable to handle 24-hour view
 * - Auto-scrolls to 6 am on mount for better initial view
 */
"use client";

import React, {useEffect, useRef} from "react";
import  {useSchedule} from "@/hooks/use-schedule";
import { TimeColumn } from "./time-column";
import { DayColumn } from "./day-column";
import { getWeekDays, isSameDay } from "@/lib/utils/date-helpers";

/**
 * WeekGrid Components
 * 
 * Renders the full week calendar grid with time slots and events
 * Automatically scrolls to 6am on mount to show the most relevant time period
 * 
 * @returns Rendered week grid
 */
export function WeekGrid(){
    const {state, actions} = useSchedule();
    const{currentWeek, selectedDay, fixedEvents, scheduleBlocks} = state;

    //Ref for scroll container to enable auto-scroll
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    //Get all 7 days in the current week
    const weekDays = getWeekDays(currentWeek);

    //Auto-scroll to 6am on mount
    useEffect(()=>{
        if(scrollContainerRef.current){
            //Each hour is 64px, 6am = 6 * 64 = 384px
            //Subtract some padding for better view
            scrollContainerRef.current.scrollTop = 6 * 64 - 100;
        }
    }, [currentWeek]); // Re-scroll when week changes

    /**
     * Handles day header click to select a day for Today view
     */
    const handleDayClick = (date: Date) =>{
        actions.setSelectedDay(date);
    };

    /**
     * Filters events for a specific day
     */
    const getEventsForDay = (date: Date) =>{
        return fixedEvents.filter((event) => isSameDay(event.startAt, date));
    };

    /**
     * Filters schedule blocks for a specific day
     */
    const getBlocksForDay = (date: Date)=>{
        return scheduleBlocks.filter((block) => isSameDay(block.startAt, date));
    };

    return(
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Calendar grid container */}
            <div ref={scrollContainerRef} className="flex-1 overflow-auto" style={{maxHeight: "calc(100vh - 200px)",}}>
                <div className="flex min-w-max">
                    {/*Time column (sticky on left) */}
                    <TimeColumn/>

                    {/* Day columns */}
                    <div className="flex flex-1">
                        {weekDays.map((day) => (
                            <DayColumn
                                key={day.toISOString()}
                                date={day}
                                fixedEvents={getEventsForDay(day)}
                                scheduleBlocks={getBlocksForDay(day)}
                                isSelected={isSameDay(day, selectedDay)}
                                onDayClick={handleDayClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}