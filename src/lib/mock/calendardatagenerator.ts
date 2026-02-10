/**
 * Calendar Data Generator
 * 
 * This file combines tasks from mockTAskgenerator with fixed events from seed-data
 * to create a unified calendar event structure. It handles:
 * 
 * Class schedule
 * Work schedules
 * Personal events
 * Generated tasks
 * 
 * All events are converted to a standard CalendarEvent format with absolute dates/times.
 */
import { CLASS_SCHEDULE, WORK_SCHEDULE, PERSONAL_EVENTS, COURSE_COLORS } from "./seed-data";
import { generateMultiWeekTasks, Task } from "./mocktaskgenerator";

/**
 * Unified Calendar Event Interface
 * This is the single source of truth for all calendar events
 */

export interface CalendarEvent{
    id: string,
    title: string,
    startTime: Date;
    endTime: Date;
    type: 'class' | 'work' | 'personal' | 'task';
    color: string;
    course?: string;
    duration: number;
    gradientClass?: string;
}

/**
 * Color configuration for different event types
 */
const EVENT_COLORS = {
    work: 'from-[#F59E0B] to-[#000000]',
    personal: 'from-[#3B82F6] to-[#000000]',
};

/**
 * Event types that do not require course-based color logic
 */
type NonClassEventType = Exclude<CalendarEvent['type'], 'class'>;

/**
 * Mapping of event types to their default color gradients
 */
const TYPE_COLOR_MAP: Record<NonClassEventType, string> = {
    work: EVENT_COLORS.work,
    personal: EVENT_COLORS.personal,
    task: 'from-[#10B981] to-[#000000]',
};

/**
 * Determines the display color for a calendar event based on its type
 */
function getEventColor(type: CalendarEvent['type'], fixedEvent: any): string {
    switch (type) {
        case 'class': {
            const courseName = fixedEvent.title.split(' ').slice(0, -1).join(' ');
            return COURSE_COLORS[courseName] || 'from-[#8B5CF6] to-[#000000]';
        }
        default:
            return TYPE_COLOR_MAP[type];
    }
}

/**
 * Convert a recurring fixed event to CalendarEvent instances for a date range
 * Fixed events (classes, work, personal) repeat weekly on specific days
 * 
 * @param {object} fixedEvent - Event from seed data
 * @param {Date} startDate - Start of date range
 * @param {Date} endDate - End of Date range
 * @param {string} type - Event type
 * @returns {CalendarEvent[]} Array of calendar events
 */
function convertFixedEventToCalendarEvents(
    fixedEvent: any,
    startDate: Date,
    endDate: Date,
    type: 'class' | 'work' | 'personal'
): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksToGenerate =
        Math.ceil((endDate.getTime() - startDate.getTime()) / millisecondsPerWeek) + 1;

    for (let week = 0; week < weeksToGenerate; week++) {
        for (const dayOfWeek of fixedEvent.days) {
            const eventDate = new Date(startDate);
            eventDate.setDate(startDate.getDate() + (week * 7) + dayOfWeek);

            if (eventDate < startDate || eventDate > endDate) continue;

            const startTime = new Date(eventDate);
            startTime.setHours(fixedEvent.startHour, fixedEvent.startMinute, 0, 0);

            const endTime = new Date(startTime);
            endTime.setMinutes(startTime.getMinutes() + fixedEvent.durationMinutes);

            const color = getEventColor(type, fixedEvent);

            events.push({
                id: `${type}-${fixedEvent.title}-${eventDate.toISOString()}`,
                title: fixedEvent.title,
                startTime,
                endTime,
                type,
                color,
                course: type === 'class' ? fixedEvent.title : undefined,
                duration: fixedEvent.durationMinutes,
            });
        }
    }

    return events;
}

/**
 * Convert a generated task to a CalendarEvent
 * Tasks are one-time events with specific dates
 * @param {Task} task - Task from mocktaskgenerator
 * @returns {CalendarEvent} Calendar Event
 */
function convertTaskToCalendarEvent(task: Task): CalendarEvent{
    //Parse the date from the tasks dateKey
    const [year, month, day] = task.dateKey.split('-').map(Number);

    //Parse the time from task time
    const timeMatch = task.time.match(/(\d+):(\d+)\s*(AM|PM)/);
    if(!timeMatch){
        throw new Error(`Invalid time format: ${task.time}`);
    }

    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const period = timeMatch[3];

    //Convert to 24-hour format
    if(period === 'PM' && hour !== 12){
        hour += 12;
    }else if(period === 'AM' && hour === 12){
        hour = 0;
    }

    //Create start time
    const startTime = new Date(year, month - 1, day, hour, minute, 0, 0);

    //Parse duration
    const durationMinutes = parseInt(task.duration);

    //Create end time
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + durationMinutes);

    return {
        id: `task-${task.id}`,
        title: task.title,
        startTime,
        endTime,
        type: 'task',
        color: task.gradientClass,
        course: task.title.split(' ')[0],
        duration: durationMinutes,
        gradientClass: task.gradientClass,
    };
}

/**
 * Generate all calendar events for a date rangfe
 * Combines fixed events with generatd tasks
 * 
 * @param {Date} startDate - Start of date range
 * @param {Date} endDate - End of date range
 * @returns {CalendarEvent[]} All calendar events in the range
 */
export function generateCalendarEvents(startDate: Date, endDate: Date): CalendarEvent[]{
    const allEvents: CalendarEvent[] = [];

    //Generate recurring class events
    CLASS_SCHEDULE.forEach(classEvent =>{
        const classEvents = convertFixedEventToCalendarEvents(classEvent, startDate, endDate, 'class');
        allEvents.push(...classEvents);
    });

    //Generate recurring work events
     WORK_SCHEDULE.forEach(workEvent => {
        const workEvents = convertFixedEventToCalendarEvents(workEvent, startDate, endDate, 'work');
        allEvents.push(...workEvents);
    });

    //Generate recurring personal events
    PERSONAL_EVENTS.forEach(personalEvent => {
        const personalEvents = convertFixedEventToCalendarEvents(personalEvent, startDate, endDate, 'personal');
        allEvents.push(...personalEvents);
    });

    //Generate one-time tasks
    //Calculate number of weeks for task genertaion
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() - startDate.getDay());

    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const numWeeks = Math.ceil((endDate.getTime() - weekStart.getTime()) / millisecondsPerWeek) + 1;

    const tasksMap = generateMultiWeekTasks(weekStart, numWeeks);

    //Convert all tasks to calendar events
    tasksMap.forEach((tasks: Task[]) => {
        tasks.forEach(task => {
            const calendarEvent = convertTaskToCalendarEvent(task);

            //Only include if within our date range
            if(calendarEvent.startTime >= startDate && calendarEvent.startTime <= endDate){
                allEvents.push(calendarEvent);
            }
        });
    });

    //Sort by start time
    allEvents.sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

    return allEvents;
}

/**
 * Get all events for a specific day
 * 
 * @param {Date} date - The date to get events for
 * @param {CalendarEvent[]} events - All avaialbale events
 * @returns {CalendarEvent[]} Events for that day, sorted by time
 */
export function getEventsForDay(date: Date, events: CalendarEvent[]): CalendarEvent[]{
    const dayStart = new Date(date);
    dayStart.setHours(0,0,0,0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23,59,59,999);

    return events.filter(event => event.startTime >= dayStart && event.startTime <=dayEnd);
}

/**
 * Get all events for a specific week
 * Week starts on Sunday and ends on Saturday
 * 
 * @param {Date} weekStart - Sunday of the week
 * @param {CalendarEvent[]} events - All available events
 * @returns {CalendarEvent[]} Events for that week
 */
export function getEventsForWeek(weekStart: Date, events: CalendarEvent[]): CalendarEvent[]{
    //Ensure weekStart is actually a Sunday
    const sunday = new Date(weekStart);
    sunday.setDate(weekStart.getDate() - weekStart.getDay());
    sunday.setHours(0,0,0,0);

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23,59,59,999);

    return events.filter(event => event.startTime >= sunday && event.startTime <= saturday);
}

/**
 * Get all events for a specific month
 * 
 * @param {Date} monthStart - First day of the month
 * @param {CalendarEvent[]} events - All available events
 * @returns {CalendarEvent[]} Events for that month
 */
export function getEventsForMonth(monthStart: Date, events: CalendarEvent[]): CalendarEvent[]{
    const firstDay = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
    firstDay.setHours(0,0,0,0);

    const lastDay = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    lastDay.setHours(23,59,59,999);

    return events.filter(event => event.startTime >= firstDay && event.startTime <= lastDay);
}

/**
 * Get the sunday of the week containing a given date
 * 
 * @param {Date} date - Any date
 * @returns {Date} The sunday of that week
 */
export function getWeekStart(date: Date): Date{
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay());
    sunday.setHours(0,0,0,0);
    return sunday;
}

/**
 * Get the first day of the month containing a given date
 * 
 * @param {Date} date - Any date
 * @returns {Date} The firsy day of that month
 */
export function getMonthStart(date: Date): Date{
    return new Date(date.getFullYear(), date.getMonth(),1);
}