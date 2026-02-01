/**
 * MobileAccordion Component
 * 
 * Mobile week view using an accordion layout.
 * Shows all 7 days as collapsible panels that can be expanded to see details.
 * 
 * Features:
 * - One accordion panel per day
 * - Panel header shows day, date, and count of items
 * - Multiple panels can be open simultaneously
 * - Each panel body shows that day's events/blocks in list format
 */

"use client";

import React from "react";
import { useSchedule } from "@/hooks/use-schedule";
import { getWeekDays, formatShortDayName, formatMonthDay, isSameDay } from "@/lib/utils/date-helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ScheduleBlock, FixedEvent } from "@/types/schedule";
import { formatTimeRange, formatDuration, calculateDuration } from "@/lib/utils/time";
import { Lock, Check, Minus, Clock, BookOpen, Briefcase, Moon, Calendar as CalendarIcon, ChevronRight } from "lucide-react";

/**
 * MobileAccordion component
 * 
 * Displays the week in an accordion format where each day is a collapsible panel.
 * Multiple days can be expanded at once to compare schedules.
 * 
 * @returns Rendered mobile accordion
 */
export function MobileAccordion() {
  const { state, actions } = useSchedule();
  const { currentWeek, selectedDay, fixedEvents, scheduleBlocks } = state;
  
  // Get all days in the current week
  const weekDays = getWeekDays(currentWeek);
  
  /**
   * Gets all events and blocks for a specific day, sorted by time
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
  
  /**
   * Handles clicking a day to select it for Today view
   */
  const handleSelectDay = (day: Date) => {
    actions.setSelectedDay(day);
  };
  
  return (
    <div className="px-4">
      <Accordion type="multiple" className="space-y-2">
        {weekDays.map((day) => {
          const items = getItemsForDay(day);
          const isSelectedForToday = isSameDay(day, selectedDay);
          
          // Count different types of items
          const fixedCount = items.filter((i) => i.type === "fixed").length;
          const blockCount = items.filter((i) => i.type === "block").length;
          
          return (
            <AccordionItem
              key={day.toISOString()}
              value={day.toISOString()}
              className={`border rounded-lg ${
                isSelectedForToday ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
              }`}
            >
              {/* Accordion header */}
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2">
                  {/* Left side: Day name and date */}
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="font-bold text-gray-900">
                        {formatShortDayName(day)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatMonthDay(day)}
                      </div>
                    </div>
                    
                    {/* Select for Today button */}
                    {!isSelectedForToday && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDay(day);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 rounded border border-indigo-300 hover:bg-indigo-50"
                      >
                        Select
                      </button>
                    )}
                    
                    {/* Selected indicator */}
                    {isSelectedForToday && (
                      <div className="text-xs text-indigo-700 font-semibold bg-indigo-100 px-2 py-1 rounded">
                        Selected
                      </div>
                    )}
                  </div>
                  
                  {/* Right side: Item counts */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {items.length > 0 ? (
                      <>
                        {fixedCount > 0 && (
                          <span className="text-xs">
                            {fixedCount} fixed
                          </span>
                        )}
                        {blockCount > 0 && (
                          <span className="text-xs text-indigo-600 font-medium">
                            {blockCount} study
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">Free day</span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              
              {/* Accordion content */}
              <AccordionContent className="px-4 pb-3">
                {items.length === 0 ? (
                  <div className="py-4 text-center text-gray-500 text-sm">
                    No events scheduled
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <AccordionBlockCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

/**
 * AccordionBlockCard component
 * 
 * Displays a single event or block within an accordion panel.
 * More compact than the day selector cards.
 */
interface AccordionBlockCardProps {
  item: (FixedEvent & { type: "fixed" }) | (ScheduleBlock & { type: "block" });
}

function AccordionBlockCard({ item }: AccordionBlockCardProps) {
  const isBlock = item.type === "block";
  const duration = calculateDuration(item.startAt, item.endAt);
  
  // Get icon
  const Icon = isBlock ? BookOpen : getFixedIcon(item as FixedEvent);
  
  // Determine styling
  const bgClass = isBlock
    ? "bg-indigo-50 border-indigo-200"
    : "bg-gray-50 border-gray-200";
  
  return (
    <div className={`p-3 border rounded-lg ${bgClass}`}>
      <div className="flex items-start gap-2">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon className="w-4 h-4 text-gray-600 mt-0.5" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="font-medium text-sm text-gray-900 truncate">
            {item.title}
          </div>
          
          {/* Course (for blocks) */}
          {isBlock && (
            <div className="text-xs text-indigo-600 font-medium">
              {(item as ScheduleBlock).course}
            </div>
          )}
          
          {/* Time */}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{formatTimeRange(item.startAt, item.endAt)}</span>
            <span>•</span>
            <span>{formatDuration(duration)}</span>
          </div>
          
          {/* Status indicators */}
          {(item.locked || (isBlock && (item as ScheduleBlock).status !== "planned")) && (
            <div className="flex items-center gap-2 mt-1">
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
          )}
        </div>
      </div>
    </div>
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