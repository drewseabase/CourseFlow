/**
 * TodayView Component
 * 
 * Main component for the Today page.
 * Displays schedule blocks for the selected day (not necessarily today).
 * 
 * Features:
 * - Shows which day is selected
 * - Filters blocks for the selected day
 * - Displays task list
 * - Provides context about selected day vs. actual today
 */

"use client";

import React from "react";
import { useSchedule } from "@/hooks/use-schedule";
import { TaskList } from "./task-list";
import { isSameDay } from "@/lib/utils/time";
import {
  formatLongDate,
  getRelativeDateString,
  isToday as checkIsToday,
} from "@/lib/utils/date-helpers";
import { Calendar, Info } from "lucide-react";

/**
 * TodayView component
 * 
 * Displays the execution list for the selected day.
 * The selected day is determined by what the user clicked in the calendar.
 * 
 * @returns Rendered today view
 */
export function TodayView() {
  const { state } = useSchedule();
  const { selectedDay, scheduleBlocks } = state;
  
  // Check if selected day is actually today
  const isActuallyToday = checkIsToday(selectedDay);
  
  // Filter blocks for the selected day
  const blocksForSelectedDay = scheduleBlocks.filter((block) =>
    isSameDay(block.startAt, selectedDay)
  );
  
  // Count blocks by status
  const plannedCount = blocksForSelectedDay.filter((b) => b.status === "planned").length;
  const doneCount = blocksForSelectedDay.filter((b) => b.status === "done").length;
  const skippedCount = blocksForSelectedDay.filter((b) => b.status === "skipped").length;
  
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Date heading */}
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {isActuallyToday ? "Today" : getRelativeDateString(selectedDay)}
              </h2>
            </div>
            
            {/* Full date */}
            <p className="text-gray-600">
              {formatLongDate(selectedDay)}
            </p>
            
            {/* Stats summary */}
            {blocksForSelectedDay.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-gray-700">
                    {plannedCount} planned
                  </span>
                </div>
                
                {doneCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-700">
                      {doneCount} done
                    </span>
                  </div>
                )}
                
                {skippedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-gray-700">
                      {skippedCount} skipped
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Info message if not viewing today */}
        {!isActuallyToday && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              You're viewing a different day. Click a day in the calendar to change 
              which day's tasks are shown here.
            </p>
          </div>
        )}
      </div>
      
      {/* Task list */}
      <div>
        <TaskList blocks={blocksForSelectedDay} />
      </div>
      
      {/* Help text */}
      {blocksForSelectedDay.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Quick actions:</strong> Mark tasks done or skipped, lock them to prevent 
            accidental moves, or adjust duration if they took more/less time than expected.
          </p>
        </div>
      )}
    </div>
  );
}