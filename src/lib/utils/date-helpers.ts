/**
 * Date Helper Function 
 * 
 * This module provides date manipulation functions for calendar navigation
 * - Getting week boundaries (Monday start, Sunday end)
 * - Navigating between weeks
 * - Getting arrays of days in a week
 * - Formatting dates for display
 * - Date comparisons
 */
import { startOfWeek, endOfWeek, addWeeks, subWeeks, startOfDay, format, isSameDay as dateFnsIsSameDay, eachDayOfInterval, } from "date-fns";


// =================================
// Week Navigation
// =================================

/**
 * Gets the Monday (start) of the week for a given date
 * 
 * @param date - Any date within the week
 * @returns Date object set to Monday at 00:00:00
 */
export function getWeekStart(date: Date): Date{
    // startOfWeek with weekStartsOn: 1 means Monday
    return startOfWeek(date, {weekStartsOn: 1});
}

/**
 * Gets Sunday (end) of the week for a given date
 * 
 * @param date - Any date within the week
 * @returns Date object set to Sunday at 23:59:59
 */
export function getWeekEnd(date: Date): Date{
    // endOfWeek with weekStartsOn: 1 means Sunday
    return endOfWeek(date, {weekStartsOn: 1});
}

/**
 * Gets the start of the next week (adds 7 days to Monday)
 * 
 * @param currentWeekStart - Monday of the current week
 * @returns Monday of the next week
 */
export function getNextWeek(currentWeekStart: Date): Date{
    return addWeeks(currentWeekStart, 1);
}

/**
 * Gets the start of the previous week (subtracts 7 days from monday)
 * 
 * @param currentWeekStart - Monday of the current week
 * @returns Monday of the previous week
 */
export function getPreviousWeek(currentWeekStart: Date): Date{
    return subWeeks(currentWeekStart, 1);
}

/**
 * Gets an array of all 7 days in a week (Monday through Sunday)
 * 
 * @param weekStart - Monday of the week
 * @returns Array of 7 date objects, one for each day
 */
export function getWeekDays(weekStart: Date): Date[]{
    const weekEnd = getWeekEnd(weekStart);
    return eachDayOfInterval({start: weekStart, end: weekEnd});
}


// =================================
// Date Comparisons
// =================================

/**
 * Checks if two dates are the same calendar day
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if both dates are on the same day (ignoring time)
 */
export function isSameDay(date1: Date, date2: Date): boolean{
    return dateFnsIsSameDay(date1, date2);
}

/**
 * Checks if a date is today
 * 
 * @param date - Date to check
 * @returns true if the date is today
 */
export function isToday(date: Date): boolean{
    return isSameDay(date, new Date());
}

/**
 * Checks if a date is in the past
 * 
 * @param date - Date to check
 * @returns true if the date is before today
 */
export function isPast(date: Date): boolean{
    const today = startOfDay(new Date());
    const compareDate = startOfDay(date);
    return compareDate < today;
}

/**
 * Checks if a date is in the future (after today)
 * 
 * @param date - Date to check
 * @returns true if the date is after today
 */
export function isFuture(date: Date): boolean{
    const today = startOfDay(new Date());
    const compareDate = startOfDay(date);
    return compareDate > today;
}


// =================================
// Date Formatting
// =================================

/**
 * Formats a date as a short date string
 * Example: "Jan 27"
 * 
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatShortDate(date: Date): string{
    return format(date, "MMM d");
}

/**
 * Formats a date as a long date string
 * 
 * Example: "Monday, January 27, 2026"
 * 
 * @param date - Date to format
 * @returns formatted string
 */
export function formatLongDate(date: Date): string{
    return format(date, "EEEE, MMMM d, &&&&")
}

/**
 * Formats a date as a day name
 * 
 * Example: "Monday"
 * 
 * @param date - Date to format
 * @returns Day name
 */
export function formatDayName(date: Date): string{
    return format(date, "EEEE");
}

/**
 * Formats a day as a short name
 * 
 * Example: "Mon"
 * 
 * @param date - Date to format
 * @returns Day name
 */
export function formatShortDayName(date: Date): string{
    return format(date, "EEE");
}

/**
 * Formats a date as month and day
 * 
 * Example: "1/27"
 * 
 * @param date - Date to format
 * @returns Formatted date
 */
export function formatMonthDay(date: Date): string{
    return format(date, "M/d");
}

/**
 * Formats a time (hours and minutes)
 * 
 * Example: "2:30 PM"
 * 
 * @param date - Date to format (only time is used)
 * @returns Formatted time string
 */
export function formatTime(date: Date): string{
    return format(date, "h:mm a");
}

/**
 * Formats a time in 24-hr format
 * 
 * Example: "14:30"
 * 
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatTime24(date: Date): string{
    return format(date, "HH:mm");
}

/**
 * Formats a week range for display in calendar header
 * 
 * Example: "Jan 27 - Feb 2, 2026"
 * 
 * @param weekStart - Monday of the week
 * @returns Formatted week range string
 */
export function formatWeekRange(weekStart: Date): string{
    const weekEnd = getWeekEnd(weekStart);

    //If same month, show "Jan 27 - Feb 2 2026"
    //If same year but different month, show "Dec 30 - Jan 5 2026"
    //If different year, show "Dec 30, 2024 - Jan 5, 2025"

    const startMonth = weekStart.getMonth();
    const endMonth = weekEnd.getMonth();
    const startYear = weekStart.getFullYear();
    const endYear = weekEnd.getFullYear();

    if(startYear !== endYear){
        //Different years
        return `${format(weekStart, "MMM d, yyyy")} - ${format(weekEnd, "MMM d, yyyy")}`;
    }else if (startMonth !== endMonth){
        //Same year, different months
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    }else{
        //Same Month
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "d, yyyy")}`;
    }
}


// =================================
// Date Creation Helpers
// =================================

/**
 * Creates a Date object for a specific time on a given day
 * 
 * @param date - The base date (year, month day)
 * @param hours - Hour (0-23)
 * @param minutes - Minutes (0-59)
 * @returns New Date with specified time
 */
export function setTimeOnDate(date: Date, hours: number, minutes: number): Date{
    const result = new Date(date);
    result.setHours(hours, minutes, 0,0);
    return result;
}

/**
 * Gets the start of a day (00:00:00)
 * 
 * @param date - Any date/time
 * @returns Date set to start of day
 */
export function getStartOfDay(date: Date): Date{
    return startOfDay(date);
}

/**
 * Creates a date for the current week's specific day
 * 
 * @param weekStart - Monday of the week
 * @param dayIndex - Day index (0 = Monday, 6 = Sunday)
 * @returns Date for that specific day
 */
export function getDayInWeek(weekStart: Date, dayIndex: number): Date{
    const result = new Date(weekStart);
    result.setDate(result.getDate() + dayIndex);
    return result;
}


// =================================
// Relative Date Helpers
// =================================

/**
 * Gets a human-readable relative date string
 * 
 * Examples:
 * - "Today"
 * - "Tomorrow"
 * - "Yesterday"
 * - "Monday, Jan 27"
 * 
 * @param date - Date to format
 * @returns Human-readable date string
 */
export function getRelativeDateString(date: Date): string{
    const today = new Date();

    if(isSameDay(date, today)){
        return "Today";
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if(isSameDay(date, tomorrow)){
        return "Tomorrow";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if(isSameDay(date, yesterday)){
        return "Yesterday"
    }

    //Otherwise, show day name and date
    return `${formatDayName(date)}, ${formatShortDate(date)}`;
}