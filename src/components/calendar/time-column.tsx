/**
 * TimeColumn Component
 * 
 * Displays the time labels (12am, 1am, 2am etc) on the left side of the 
 * calendar
 * 
 * Shows all 24 hours of the day in a vertical column
 * 
 * This component is sticky and stays visible when scrolling horizontally
 */
"use client";
import React from "react";

/**
 * TimeColumn Component
 * 
 * Renders a vertical list of hour labels from 12am to 11pm.
 * Each hour label is positioned to align with the corresponding row in 
 * the calendar grid
 * 
 * @returns Time label column for the calendar
 */
export function TimeColumn(){
    //Generate array of hours (0-23)
    const hours = Array.from({length: 24}, (_,i) => i);

    return(
        <div className="flex flex-col border-r border-gray-200 bg-white sticky left-0 z-10">
            {/* Header spacer to align with the day headers */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-center text-xs 
            font-semibold text-gray-500">
                Time
            </div>

            {/* Time Labels */}
            <div className = "relative">
                {hours.map((hour) => (
                    <div 
                        key={hour}
                        className="h-16 border-b border-gray-100 flex items-start justify-end
                        pr-12 pt-1"
                        style={{
                            //Each hour takes up 4 intervals (15min each) = 16px * 4 = 64px
                            minHeight: "64px",
                        }}>
                        <span className="text-xs text-gray-500 leading-none">
                            {formatHour(hour)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    /**
     * Formats an hour (0-23) into 12-hour format with am/pm
     * 
     * Examples:
     * - 0 -> 12am
     * - 1 -> 1am
     * 
     * @param hour - Hour in 24-hour format (0-23)
     * @returns Formatted time string
     */
    function formatHour(hour: number): string{
        if(hour === 0){
            return "12am";
        }else if (hour < 12){
            return `${hour}am`;
        }else if (hour === 12){
            return "12pm";
        }else {
            return `${hour - 12}pm`;
        }
    }
}