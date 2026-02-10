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

  return (
    <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
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
            className="w-10 h-10 border-0 rounded-[10px] bg-[#FAFAFA] cursor-pointer text-lg transition-all duration-200 hover:scale-110 hover:bg-[#E4E4E7]"
            aria-label="Previous month"
          >
            ◀
          </button>
          
          {/* Next Month Button */}
          <button
            onClick={nextMonth}
            className="w-10 h-10 border-0 rounded-[10px] bg-[#FAFAFA] cursor-pointer text-lg transition-all duration-200 hover:scale-110 hover:bg-[#E4E4E7]"
            aria-label="Next month"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Calendar Grid - 7 columns (one for each day of week) */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers (Sun, Mon, Tue, etc.) */}
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="text-center text-xs font-bold text-[#A1A1AA] py-3 uppercase"
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
           * 1. Selected (highest priority) - purple/pink gradient
           * 2. Today but not selected - subtle border outline
           * 3. Normal day - light background
           */
          
          return (
            <div
              key={`day-${dayObj.day}`}
              onClick={() => handleDayClick(dayObj.day)}
              className={`
                aspect-square rounded-[14px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative
                ${isSelectedDate
                  ? 'bg-linear-to-br from-[#667eea] to-[#764ba2] text-white font-bold' 
                  : isTodayDate
                    ? 'bg-[#FAFAFA] hover:scale-105 hover:bg-[#E4E4E7] border-2 border-[#667eea]'
                    : 'bg-[#FAFAFA] hover:scale-105 hover:bg-[#E4E4E7]'
                }
              `}
            >
              {/* Day Number */}
              <div className="text-base font-semibold">
                {dayObj.day}
              </div>

              {/* Event Indicator Dot */}
              {hasEventIndicator && (
                <div 
                  className={`
                    absolute bottom-1.5 w-1 h-1 rounded-full
                    ${isSelectedDate ? 'bg-white' : 'bg-[#8B5CF6]'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}