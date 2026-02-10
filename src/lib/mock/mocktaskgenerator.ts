/**
 * Mock Task Generator
 * 
 * This file generates realistic tasks/assignments for different dates
 * based on the seed data configuration. It creates a deterministic
 * schedule that can be used for demonstration purposes.
 */

import { COURSES, ASSIGNMENT_TEMPLATES, WEEKLY_ASSIGNMENTS_CONFIG } from './seed-data';

/**
 * Task interface matching the TodaysFocus component structure
 */
export interface Task {
  id: number;
  duration: string;        // e.g., "60 min"
  title: string;           // e.g., "ECON 101 Problem Set"
  time: string;            // e.g., "9:00 AM"
  dueDate: string;         // e.g., "Due Friday"
  gradientClass: string;   // Tailwind gradient class
  dateKey: string;         // Date in YYYY-MM-DD format for lookup
}

/**
 * Gradient classes that rotate through tasks
 * These match the original CourseFlow design
 */
const GRADIENT_CLASSES = [
  "from-[#667eea] to-[#764ba2]",  // Purple
  "from-[#4facfe] to-[#00f2fe]",  // Blue
  "from-[#43e97b] to-[#38f9d7]",  // Green
  "from-[#fa709a] to-[#fee140]",  // Pink-Yellow
  "from-[#f093fb] to-[#f5576c]",  // Pink-Red
];

/**
 * Convert a Date object to YYYY-MM-DD format for consistent key lookup
 * @param {Date} date - The date to format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get day name from date for due date display
 * @param {Date} date - The date
 * @returns {string} Day name (e.g., "Monday")
 */
const getDayName = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Format time in 12-hour format
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
const formatTime = (hour: number, minute: number = 0): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
};

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Seed the random number generator for deterministic results
 * This ensures the same tasks are generated each time for consistency
 * @param {number} seed - Seed value
 */
const seededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

/**
 * Generate tasks for a given week starting from a specific date
 * @param {Date} weekStart - The start date of the week (typically a Monday)
 * @returns {Map<string, Task[]>} Map of date keys to arrays of tasks
 */
export const generateWeeklyTasks = (weekStart: Date): Map<string, Task[]> => {
  const tasksMap = new Map<string, Task[]>();
  let taskIdCounter = 1;
  
  // Create seeded random for consistent generation
  const random = seededRandom(weekStart.getTime());
  
  // Generate tasks for the entire week (7 days)
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + dayOffset);
    const dateKey = getDateKey(currentDate);
    
    // Determine how many tasks this day should have based on distribution
    const numTasks = getTaskCountForDay(dayOffset, random);
    const dailyTasks: Task[] = [];
    
    // Generate tasks for this day
    for (let i = 0; i < numTasks; i++) {
      const task = generateSingleTask(taskIdCounter, currentDate, i, random);
      dailyTasks.push(task);
      taskIdCounter++;
    }
    
    // Sort tasks by time
    dailyTasks.sort((a, b) => {
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeA - timeB;
    });
    
    tasksMap.set(dateKey, dailyTasks);
  }
  
  return tasksMap;
};

/**
 * Determine how many tasks a specific day should have
 * @param {number} dayOffset - Day offset from week start (0-6)
 * @param {Function} random - Seeded random function
 * @returns {number} Number of tasks for this day
 */
const getTaskCountForDay = (dayOffset: number, random: () => number): number => {
  // Some days have more tasks than others (based on typical student schedule)
  const distribution = [2, 3, 2, 3, 2, 1, 1]; // Mon-Sun
  const baseCount = distribution[dayOffset];
  
  // Add some randomness (0 or 1 additional task)
  const extraTask = random() > 0.6 ? 1 : 0;
  
  return baseCount + extraTask;
};

/**
 * Generate a single task
 * @param {number} id - Unique task ID
 * @param {Date} date - Date this task is scheduled for
 * @param {number} taskIndex - Index of this task in the day (for variety)
 * @param {Function} random - Seeded random function
 * @returns {Task} Generated task object
 */
const generateSingleTask = (
  id: number,
  date: Date,
  taskIndex: number,
  random: () => number
): Task => {
  // Pick a random assignment template
  const template = ASSIGNMENT_TEMPLATES[Math.floor(random() * ASSIGNMENT_TEMPLATES.length)];
  
  // Pick a random course from the template's valid courses
  const course = template.courses[Math.floor(random() * template.courses.length)];
  
  // Generate duration within the template's range
  const minDuration = template.durationRange[0];
  const maxDuration = template.durationRange[1];
  const durationMinutes = Math.floor(random() * (maxDuration - minDuration + 1)) + minDuration;
  
  // Generate scheduled time (spread throughout the day)
  const studyHours = [9, 10, 14, 15, 19, 20, 21];
  const hour = studyHours[Math.floor(random() * studyHours.length)];
  
  // Generate due date (1-5 days in the future)
  const daysUntilDue = Math.floor(random() * 5) + 1;
  const dueDate = new Date(date);
  dueDate.setDate(date.getDate() + daysUntilDue);
  const dueDateString = `Due ${getDayName(dueDate)}`;
  
  // Create the task title
  const title = `${course} ${template.type}`;
  
  // Assign gradient (rotate through available gradients)
  const gradientClass = GRADIENT_CLASSES[id % GRADIENT_CLASSES.length];
  
  return {
    id,
    duration: `${durationMinutes} min`,
    title,
    time: formatTime(hour),
    dueDate: dueDateString,
    gradientClass,
    dateKey: getDateKey(date),
  };
};

/**
 * Parse time string to minutes for sorting
 * @param {string} timeStr - Time string (e.g., "2:30 PM")
 * @returns {number} Minutes since midnight
 */
const parseTime = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return hour * 60 + minute;
};

/**
 * Generate tasks for multiple weeks
 * This is useful for populating a month or longer period
 * @param {Date} startDate - Starting date
 * @param {number} numWeeks - Number of weeks to generate
 * @returns {Map<string, Task[]>} Map of all tasks across all weeks
 */
export const generateMultiWeekTasks = (startDate: Date, numWeeks: number): Map<string, Task[]> => {
  const allTasksMap = new Map<string, Task[]>();
  
  for (let week = 0; week < numWeeks; week++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (week * 7));
    
    const weekTasks = generateWeeklyTasks(weekStart);
    
    // Merge week tasks into main map
    weekTasks.forEach((tasks, dateKey) => {
      allTasksMap.set(dateKey, tasks);
    });
  }
  
  return allTasksMap;
};

/**
 * Get tasks for a specific date
 * @param {Date} date - The date to get tasks for
 * @param {Map<string, Task[]>} tasksMap - The tasks map
 * @returns {Task[]} Array of tasks for the date (empty array if none)
 */
export const getTasksForDate = (date: Date, tasksMap: Map<string, Task[]>): Task[] => {
  const dateKey = getDateKey(date);
  return tasksMap.get(dateKey) || [];
};