/**
 * WeekView Component
 * 
 * Top-level calendar component that includes:
 * - Week Navigation
 * - Current week date range display
 * - WeekGrid or Mobile Calendar
 * 
 * This is the main component rendered on the /calendar page
 */
"use client";
import React from "react";
import { useSchedule } from "@/hooks/use-schedule";
import { WeekGrid } from "./week-grid";
import {MobileCalendar} from "./mobile-calendar";
import {useMobileDetect} from "@/hooks/use-mobile-detect";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekRange, getNextWeek, getPreviousWeek, getWeekStart } from "@/lib/utils/date-helpers";
import { generateMockWeek } from "@/lib/mock/generator";
import { mock } from "node:test";

/**
 * WeekView component
 * 
 * Main calendar view with week navigation and responsive layout
 * Handles:
 * - Navigating between weeks
 * - Loading mock data for new weeks
 * - Responsive switching between desktop grid and mobile views
 * 
 * @returns Rendered calendar view
 */
export function WeekView(){
    const {state, actions} = useSchedule();
    const {currentWeek} = state;

    //Detect if we're on mobile
    const isMobile = useMobileDetect();

    /**
     * Handles clicking the "Previous Week" button
     * Loads new mock data for the previous week
     */
    const handlePreviousWeek = () =>{
        const prevWeek = getPreviousWeek(currentWeek);
        const mockData = generateMockWeek(prevWeek);

        //Update state with new week data
        actions.loadMockData({
            ...mockData,
            currentWeek: prevWeek,
            selectedDay: state.selectedDay,
        });
    };

    /**
     * Handles clicking the "Next Week" button
     * Loads new mock data for the next week
     */
    const handleNextWeek = () => {
        const nextWeek = getNextWeek(currentWeek);
        const mockData = generateMockWeek(nextWeek);

        //Update state with new week data
        actions.loadMockData({
            ...mockData, 
            currentWeek: nextWeek,
            selectedDay: state.selectedDay,
        });
    };

    /**
     * Handles clicking "Today" button to jump to current week
     */
    const handleToday = () =>{
        const today = new Date();
        const weekStart = getWeekStart(today);
        const mockData = generateMockWeek(weekStart);

        actions.loadMockData({
            ...mockData,
            currentWeek: weekStart,
            selectedDay: today,
        });
    };

    return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header with navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Week range display */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {formatWeekRange(currentWeek)}
          </h2>
          
          {/* Today button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="text-sm"
          >
            Today
          </Button>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousWeek}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            className="flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar grid */}
      {/* Conditionally render desktop or mobile view */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? <MobileCalendar /> : <WeekGrid />}
      </div>
      
      {/* Help text */}
      <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> {isMobile 
            ? "Toggle between day view and week view using the button above. Tap a day header to select it for the Today view."
            : "Click a day header to select it for the Today view. Study blocks are draggable to reschedule them."
          }
        </p>
      </div>
    </div>
  );
}