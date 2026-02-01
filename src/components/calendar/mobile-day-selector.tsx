/**
 * MobileDaySelector Component
 * 
 * Mobile view that shows a single day at a time.
 * Features:
 * - Tabs for selecting which day to view
 * - Selected day's blocks shown in a vertical list
 * - Each block rendered as a card with full details
 * - Maintains drag-and-drop functionality
 */

"use client";

import React, { useState } from "react";
import { useSchedule } from "@/hooks/use-schedule";
import { getWeekDays, formatShortDayName, formatMonthDay, isSameDay } from "@/lib/utils/date-helpers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScheduleBlock, FixedEvent } from "@/types/schedule";
import { formatTimeRange, formatDuration, calculateDuration } from "@/lib/utils/time";
import { Lock, Check, Minus, Clock, BookOpen, Briefcase, Moon, Calendar as CalendarIcon } from "lucide-react";

/**
 * MobileDaySelector component
 * 
 * Displays a tab selector for days of the week and shows the selected day's
 * blocks in a list format optimized for mobile.
 * 
 * @returns Rendered mobile day selector
 */
export function MobileDaySelector() {
  const { state, actions } = useSchedule();
  const { currentWeek, selectedDay, fixedEvents, scheduleBlocks } = state;
  
  // Get all days in the current week
  const weekDays = getWeekDays(currentWeek);
  
  // State for currently displayed day (different from selectedDay for Today view)
  const [displayedDay, setDisplayedDay] = useState(selectedDay);
  
  /**
   * Handles day selection
   * Updates both the displayed day and the selected day for Today view
   */
  const handleDaySelect = (day: Date) => {
    setDisplayedDay(day);
    actions.setSelectedDay(day);
  };
  
  /**
   * Gets all events and blocks for a specific day
   */
  const getItemsForDay = (day: Date) => {
    const dayFixedEvents = fixedEvents.filter((event) =>
      isSameDay(event.startAt, day)
    );
    const dayBlocks = scheduleBlocks.filter((block) =>
      isSameDay(block.startAt, day)
    );
    
    // Combine and sort by start time
    const allItems = [
      ...dayFixedEvents.map((e) => ({ ...e, type: "fixed" as const })),
      ...dayBlocks.map((b) => ({ ...b, type: "block" as const })),
    ].sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
    
    return allItems;
  };
  
  return (
    <div className="px-4">
      {/* Day selector tabs */}
      <Tabs
        value={displayedDay.toISOString()}
        onValueChange={(value) => {
          const day = weekDays.find((d) => d.toISOString() === value);
          if (day) handleDaySelect(day);
        }}
      >
        {/* Tab list */}
        <TabsList className="grid grid-cols-7 w-full mb-4">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, displayedDay);
            const isSelectedForToday = isSameDay(day, selectedDay);
            
            return (
              <TabsTrigger
                key={day.toISOString()}
                value={day.toISOString()}
                className={`flex flex-col py-2 ${
                  isSelectedForToday ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <span className="text-xs font-semibold">
                  {formatShortDayName(day).charAt(0)}
                </span>
                <span className="text-xs">
                  {day.getDate()}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {/* Tab content for each day */}
        {weekDays.map((day) => {
          const items = getItemsForDay(day);
          
          return (
            <TabsContent key={day.toISOString()} value={day.toISOString()}>
              {/* Day header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {formatShortDayName(day)}, {formatMonthDay(day)}
                </h3>
                <p className="text-sm text-gray-600">
                  {items.length} {items.length === 1 ? "item" : "items"} scheduled
                </p>
              </div>
              
              {/* Items list */}
              {items.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No events scheduled for this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <MobileBlockCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

/**
 * MobileBlockCard component
 * 
 * Displays a single event or block as a card in mobile view
 */
interface MobileBlockCardProps {
  item: (FixedEvent & { type: "fixed" }) | (ScheduleBlock & { type: "block" });
}

function MobileBlockCard({ item }: MobileBlockCardProps) {
  const isBlock = item.type === "block";
  const duration = calculateDuration(item.startAt, item.endAt);
  
  // Get icon
  const Icon = isBlock ? BookOpen : getFixedIcon(item as FixedEvent);
  
  // Determine card styling
  const cardClasses = isBlock
    ? "border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-white"
    : "border-l-4 border-l-gray-400 bg-gray-50";
  
  return (
    <Card className={`p-4 ${cardClasses}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-semibold text-gray-900 truncate">
            {item.title}
          </h4>
          
          {/* Course (for blocks) */}
          {isBlock && (
            <p className="text-sm text-indigo-600 font-medium">
              {(item as ScheduleBlock).course}
            </p>
          )}
          
          {/* Time and duration */}
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTimeRange(item.startAt, item.endAt)}</span>
            </div>
            <span>•</span>
            <span>{formatDuration(duration)}</span>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center gap-2 mt-2">
            {item.locked && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <span>Locked</span>
              </div>
            )}
            
            {isBlock && (
              <>
                {(item as ScheduleBlock).status === "done" && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="w-3 h-3" />
                    <span>Done</span>
                  </div>
                )}
                
                {(item as ScheduleBlock).status === "skipped" && (
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <Minus className="w-3 h-3" />
                    <span>Skipped</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Gets the appropriate icon for a fixed event
 */
function getFixedIcon(event: FixedEvent) {
  switch (event.category) {
    case "class":
      return BookOpen;
    case "work":
      return Briefcase;
    case "sleep":
      return Moon;
    default:
      return CalendarIcon;
  }
}