'use client';

import { useState } from 'react';
import { getDateKey } from '@/lib/mock/mocktaskgenerator';

/**
 * Calendar Component
 * 
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onDateSelect - Callback when a date is clicked
 * @param {Map} props.tasksMap - Map of all tasks for event indicators
 */
export default function Calendar({ selectedDate, onDateSelect, tasksMap }) {
  // Get current date (actual today, not selected date)
  const today = new Date();
  
  // Use selectedDate if provided, otherwise fall back to today
  const dateToUse = selectedDate || today;
  
  // State to track current month and year being displayed
  // Initialize from selectedDate instead of today
  const [currentMonth, setCurrentMonth] = useState(dateToUse.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(dateToUse.getFullYear());

  // Array of month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Array of day names for calendar header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /**
   * Get the number of days in a specific month/year
   * @param {number} month - Month (0-11)
   * @param {number} year - Full year
   * @returns {number} Number of days in the month
   */
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  /**
   * Get the day of week (0-6) that the month starts on
   * @param {number} month - Month (0-11)
   * @param {number} year - Full year
   * @returns {number} Day of week (0 = Sunday, 6 = Saturday)
   */
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  /**
   * Check if a specific date is today
   * @param {number} day - Day of month
   * @param {number} month - Month (0-11)
   * @param {number} year - Full year
   * @returns {boolean} True if the date is today
   */
  const isToday = (day, month, year) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  /**
   * Check if a specific date is the selected date
   * @param {number} day - Day of month
   * @param {number} month - Month (0-11)
   * @param {number} year - Full year
   * @returns {boolean} True if the date is selected
   */
  const isSelected = (day, month, year) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  /**
   * Check if a date has any events/tasks (uses actual data from tasksMap)
   * @param {number} day - Day of month
   * @param {number} month - Month (0-11)
   * @param {number} year - Full year
   * @returns {boolean} True if day has tasks/events
   */
  const hasEvent = (day, month, year) => {
    const date = new Date(year, month, day);
    const dateKey = getDateKey(date);
    const tasks = tasksMap.get(dateKey);
    return tasks && tasks.length > 0;
  };

  /**
   * Handle click on a calendar day
   * Calls the parent's onDateSelect callback with the clicked date
   * @param {number} day - Day of month that was clicked
   */
  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    onDateSelect(clickedDate);
  };

  /**
   * Navigate to previous month
   * Handles year rollover (December -> January of previous year)
   */
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  /**
   * Navigate to next month
   * Handles year rollover (December -> January of next year)
   */
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /**
   * Generate array of day objects for the calendar grid
   * Includes empty slots for days before the month starts
   * @returns {Array} Array of day objects with day number and empty flag
   */
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, isEmpty: true });
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isEmpty: false });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const panel =
    'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';

  const navBtnHover = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'translate(-2px, -2px)';
      e.currentTarget.style.boxShadow = '3px 3px 0px 0px #18181B';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  return (
    <div className={`p-7 ${panel}`}>
      {/* Calendar Header - Month/Year display and navigation controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-[24px] font-bold">
          {monthNames[currentMonth]} {currentYear}
        </div>
        
        {/* Navigation Controls */}
        <div className="flex gap-3">
          {/* Previous Month Button */}
          <button
            onClick={previousMonth}
            className="w-10 h-10 rounded-[10px] border-[1.5px] border-violet-400/35 bg-violet-500/10 text-violet-700 cursor-pointer flex items-center justify-center transition-all duration-150"
            aria-label="Previous month"
            {...navBtnHover}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          
          {/* Next Month Button */}
          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-[10px] border-[1.5px] border-violet-400/35 bg-violet-500/10 text-violet-700 cursor-pointer flex items-center justify-center transition-all duration-150"
            aria-label="Next month"
            {...navBtnHover}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid - 7 columns (one for each day of week) */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers (Sun, Mon, Tue, etc.) */}
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="text-center text-xs font-bold text-black py-3 uppercase"
          >
            {dayName}
          </div>
        ))}

        {/* Calendar Day Cells */}
        {calendarDays.map((dayObj, index) => {
          // Empty cell (before month starts)
          if (dayObj.isEmpty) {
            return (
              <div
                key={`empty-${index}`}
                className="aspect-square"
              />
            );
          }

          // Actual day cell - determine visual state
          const isTodayDate = isToday(dayObj.day, currentMonth, currentYear);
          const isSelectedDate = isSelected(dayObj.day, currentMonth, currentYear);
          const hasEventIndicator = hasEvent(dayObj.day, currentMonth, currentYear);

          /**
           * Visual State Priority:
           * 1. Selected (highest priority) - white with dark border
           * 2. Today but not selected - violet tint
           * 3. Normal day - soft white
           */

          return (
            <div
              key={`day-${dayObj.day}`}
              onClick={() => handleDayClick(dayObj.day)}
              className={[
                'aspect-square rounded-[14px] flex flex-col items-center justify-center cursor-pointer transition-all duration-150 relative',
                isSelectedDate
                  ? 'bg-white/95 border-2 border-violet-900/35 font-bold text-zinc-900'
                  : isTodayDate
                  ? 'bg-violet-500/10 border-[1.5px] border-violet-400/35 text-violet-700 font-bold'
                  : 'bg-white/75 border border-zinc-900/8 text-zinc-900',
              ].join(' ')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-1px, -1px)';
                e.currentTarget.style.boxShadow = isTodayDate
                  ? '2px 2px 0px 0px #7c3aed'
                  : '2px 2px 0px 0px #18181B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Day Number */}
              <div className="text-base font-semibold">
                {dayObj.day}
              </div>

              {/* Event Indicator Dot */}
              {hasEventIndicator && (
                <div
                  className={[
                    'absolute bottom-1.5 w-1 h-1 rounded-full',
                    isSelectedDate ? 'bg-violet-500' : 'bg-violet-500',
                  ].join(' ')}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
