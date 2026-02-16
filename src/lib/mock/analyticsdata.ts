/**
 * Analytics Data
 * 
 * Generates analytics metrics and statistics from existing calendar
 * Provides data for:
 * - Overall stats
 * - Study hours
 * - Course performance
 * - Weekly productivty data
 */

import StudyHours from "@/components/dashboard/studyhours";
import { generateCalendarEvents, getEventsForDay, CalendarEvent } from "./calendardatagenerator";
import { getAllCourses } from "./coursedata";

/**
 * Interface for stat card data
 */
export interface AnalyticsStat{
    icon: string;
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
}

/**
 * Interface for study hours data across different time periods
 */
export interface StudyHoursData{
    daily: {day: string; hours: number}[];
    weekly: {week: string; hours: number}[];
    monthly: {month: string; hours: number}[];
}

/**
 * Interface for course performance data
 */
export interface CoursePerformance{
    courseName: string;
    gradientClass: string;
    totalAssignments: number;
    completedAssignments: number;
    percentage: number;
}

/**
 * Interface for daily productivity data
 */
export interface ProductivityDay{
    day: string;
    tasksCompleted: number;
    studyHours: string;
    completionRate: number;
    focusScore: number;
}

/**
 * Calculate total study hours from calendar events
 * Sums up duration of all events
 * 
 * @param {CalendarEvent[]} events - Array of calendar events
 * @returns {number} Total Hours
 */
function calculateTotalStudyHours(events: CalendarEvent[]): number{
    const totalMinutes = events.reduce((sum, event) => sum + event.duration, 0);
    return Math.round(totalMinutes / 60);
}

/**
 * Calculate study hours for a specific day
 * 
 * @param {Date} date - The date to calculate for
 * @param {CalendarEvent[]} allEvents - All available events
 * @returns {number} Hours for that day
 */
function calculateDayStudyHours(date: Date, allEvents: CalendarEvent[]): number{
    const dayEvents = getEventsForDay(date, allEvents);
    const totalMinutes = dayEvents.reduce((sum, event) => sum + event.duration, 0);
    return Math.round(totalMinutes / 60);
}

/**
 * Format minutes into an 'Xh Ym' format
 * 
 * @param {number} minutes - Total Minutes
 * @returns {string} Formatted string
 */
function formatStudyTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

/**
 * Get the 4 main statistics for the stats grid
 * Currently using static mock data for trends
 * 
 * @param {CalendarEvent[]} events - All Calendar events
 * @returns {AnalyticsStat[]} Array of 4 stat objects
 */
export function getStatsData(events: CalendarEvent[]): AnalyticsStat[]{
    const totalHours = calculateTotalStudyHours(events);

    return [
        {
      icon: '📚',
      label: 'Total Study Hours',
      value: `${totalHours}h`,
      change: '↑ 12% from last week',
      isPositive: true,
    },
    {
      icon: '✅',
      label: 'Completion Rate',
      value: '94%',
      change: '↑ 5% from last week',
      isPositive: true,
    },
    {
      icon: '⏱️',
      label: 'Avg Session Time',
      value: '52m',
      change: '↓ 3% from last week',
      isPositive: false,
    },
    {
      icon: '🎯',
      label: 'On-Time Submissions',
      value: '96%',
      change: '↑ 2% from last week',
      isPositive: true,
    },
    ];
}

/**
 * Get study hours data for bar chart
 * Generates daily, weekly, monthly breakdowns
 * 
 * @param {CalendarEvent[]} allEvents - All calendar events
 * @returns {StudyHoursData} Study hours across different time periods
 */
export function getStudyHoursData(allEvents: CalendarEvent[]): StudyHoursData{
    const today = new Date();

    const dailyData = [];
    const dayNames = ['Mon', 'Tues','Wed','Thu','Fri','Sat','Sun'];

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    for(let i = 0; i < 7; i++){
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + i);

        const hours = calculateDayStudyHours(currentDay, allEvents);

        dailyData.push({
            day: dayNames[i === 0 ? 6 : i - 1],
            hours,
        });
    }

    const weeklyData = [
        { week: 'Week 1', hours: 45 },
        { week: 'Week 2', hours: 52 },
        { week: 'Week 3', hours: 48 },
        { week: 'Week 4', hours: 60 },
    ];

    const monthlyData = [
        { month: 'Dec', hours: 180 },
        { month: 'Jan', hours: 195 },
        { month: 'Feb', hours: 210 },
    ];

    return {
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData,
    };
}

/**
 * Get course performance data
 * Uses course metadata and static mock percentages
 * 
 * @returns {CoursePerformance[]} Array of course performance objects
 */
export function getCoursePerformanceData(): CoursePerformance[]{
    const courses = getAllCourses();

    const mockPercentages = [94,91,88,96,85];

    return courses.map((course, index) => ({
        courseName: course.name,
        gradientClass: course.gradientClass,
        totalAssignments: course.stats.total,
        completedAssignments: course.stats.completed,
        percentage: mockPercentages[index] || 90,
    }));
}

/**
 * Get Weekly productivity breakdowns
 * Currently using mock data
 * 
 * @returns {ProductivityDay[]} Array of 7 days with productivity metrics
 */
export function getProductivityData(): ProductivityDay[] {
  return [
    {
      day: 'Monday',
      tasksCompleted: 12,
      studyHours: '9h 15m',
      completionRate: 100,
      focusScore: 92,
    },
    {
      day: 'Tuesday',
      tasksCompleted: 15,
      studyHours: '10h 30m',
      completionRate: 93,
      focusScore: 88,
    },
    {
      day: 'Wednesday',
      tasksCompleted: 18,
      studyHours: '12h 00m',
      completionRate: 94,
      focusScore: 95,
    },
    {
      day: 'Thursday',
      tasksCompleted: 10,
      studyHours: '7h 45m',
      completionRate: 80,
      focusScore: 75,
    },
    {
      day: 'Friday',
      tasksCompleted: 14,
      studyHours: '11h 20m',
      completionRate: 100,
      focusScore: 90,
    },
    {
      day: 'Saturday',
      tasksCompleted: 8,
      studyHours: '6h 00m',
      completionRate: 100,
      focusScore: 85,
    },
    {
      day: 'Sunday',
      tasksCompleted: 6,
      studyHours: '5h 30m',
      completionRate: 100,
      focusScore: 82,
    },
  ];
}

/**
 * Generate all analytics data
 * Convenience function to load everything at once
 * 
 * @returns {Object} All analytics data
 */
export function generateAnalyticsData(){
    const today = new Date();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 14);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    const allEvents = generateCalendarEvents(startDate, endDate);

    return{
        stats: getStatsData(allEvents),
        StudyHours: getStudyHoursData(allEvents),
        coursePerformance: getCoursePerformanceData(),
        productivity: getProductivityData(),
    };
}

