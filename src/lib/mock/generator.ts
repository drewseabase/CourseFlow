/**
 * Mock Data Generator
 * 
 * This module generates deterministic, realistic mock schedule data for development.
 * This data includes:
 * - Fixed events
 * - Assignments with due dates
 * - Study blocks scheduled before assignment due dates
 * 
 * The generator is DETERMINISTIC - given the same week, it produces the same data.
 */

import { FixedEvent, Assignment, ScheduleBlock, EventCategory, Status, ScheduleState } from "@/types/schedule";
import { CLASS_SCHEDULE, WORK_SCHEDULE, PERSONAL_EVENTS, SLEEP_SCHEDULE, ASSIGNMENT_TEMPLATES, 
    WEEKLY_ASSIGNMENTS_CONFIG, COURSE_COLORS, PREFERRED_STUDY_HOURS, MAX_BLOCK_DURATION_MINUTES } from "./seed-data";
import { getWeekDays, setTimeOnDate, getDayInWeek } from "../utils/date-helpers";
import { addMinutes, snapToInterval } from "../utils/time";
import { start } from "repl";
import { getWeek } from "date-fns";


// =================================
// Fixed Event Generation
// =================================

/**
 * Generates all fixed events
 * 
 * @param weekStart - Monday of the week to generate events for
 * @returns Array of fixed events covering the entire week
 */
function generateFixedEvents(weekStart: Date): FixedEvent[]{
    const events: FixedEvent[] = [];
    let eventIdCounter = 1;

    //Get all days in the week
    const weekDays = getWeekDays(weekStart);

    // Generate class events
    for(const classConfig of CLASS_SCHEDULE){
        for(const dayIndex of classConfig.days){
            const day = weekDays[dayIndex];
            const startAt = setTimeOnDate(day, classConfig.startHour, classConfig.startMinute);
            const endAt = addMinutes(startAt, classConfig.durationMinutes);

            events.push({
                id: `fixed-${eventIdCounter++}`,
                title: classConfig.title,
                category: classConfig.category,
                startAt,
                endAt,
                locked: true,
            });
        }
    }

    //Generate work shifts
    for(const workConfig of WORK_SCHEDULE){
        for(const dayIndex of workConfig.days){
            const day = weekDays[dayIndex];
            const startAt = setTimeOnDate(day, workConfig.startHour, workConfig.startMinute);
            const endAt = addMinutes(startAt, workConfig.durationMinutes);

            events.push({
                id: `fixed-${eventIdCounter++}`,
                title: workConfig.title,
                category: workConfig.category,
                startAt,
                endAt,
                locked: true,
            });
        }
    }

    //Generate Personal Events
    for(const personalConfig of PERSONAL_EVENTS){
        for(const dayIndex of personalConfig.days){
            const day = weekDays[dayIndex];
            const startAt = setTimeOnDate(day, personalConfig.startHour, personalConfig.startMinute);
            const endAt = addMinutes(startAt, personalConfig.durationMinutes);

            events.push({
                id: `fixed-${eventIdCounter++}`,
                title: personalConfig.title,
                category: personalConfig.category,
                startAt,
                endAt,
                locked: true,
            });
        }
    }

    //Generate sleep blocks for each day
    //Note: Sleep spans midnight, so we create it as starting on one day
    for(let dayIndex = 0; dayIndex < 7; dayIndex++){
        const day = weekDays[dayIndex];
        const startAt = setTimeOnDate(day, SLEEP_SCHEDULE.startHour, SLEEP_SCHEDULE.startMinute);
        const endAt = addMinutes(startAt, SLEEP_SCHEDULE.durationMinutes);

        events.push({
            id: `fixed-${eventIdCounter++}`,
            title: SLEEP_SCHEDULE.title,
            category: SLEEP_SCHEDULE.category,
            startAt,
            endAt,
            locked: true
        });
    }
    return events;
}

// =================================
// Assignment Generation
// =================================

/**
 * Generates a deterministic psuedo-random number based on a seed
 * Uses a simple LCG (Linear Congruential Generator)
 * 
 * @param seed - Seed value
 * @returns Number between 0 and 1
 */

function seededRandom(seed: number): number{
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * Selects a random element from an array using a seed
 * 
 * @param array - Array to select from
 * @param seed - Seed for deterministic selection
 * @returns Selected element
 */

function seededChoice<T>(array: readonly T[], seed: number): T{
    const index = Math.floor(seededRandom(seed) * array.length);
    return array[index];
}

/**
 * Generates assignments for a week based on configuration
 * 
 * @paaram weekStart - Monday of the week
 * @returns Array of assignments with due dates in the week
 */
function generateAssignments(weekStart: Date): Assignment[]{
    const assignments: Assignment[] = []
    let assignmentIdCounter = 1;

    //Use week timestamp as base seed for deterministic generation
    const weekSeed = weekStart.getTime();
    let globalSeed = weekSeed;

    //Generate assignments based on due date distribution
    for (const[dayOffsetStr, count] of Object.entries(
        WEEKLY_ASSIGNMENTS_CONFIG.dueDateDistribution
    )){
        const dayOffset = parseInt(dayOffsetStr);

        for (let i = 0; i < count; i++){
            globalSeed += 1;

            //Select assignment template
            const template = seededChoice(ASSIGNMENT_TEMPLATES, globalSeed);

            //Select course from template's allowed courses
            globalSeed += 1;
            const course = seededChoice(template.courses, globalSeed);

            // Select due time
            globalSeed += 1;
            const dueHour = seededChoice(WEEKLY_ASSIGNMENTS_CONFIG.dueTimes, globalSeed);

            // Calculate duration (within template range)
            globalSeed += 1;
            const [minDuration, maxDuration] = template.durationRange;
            const durationRange = maxDuration - minDuration;
            const duration = minDuration + Math.floor(seededRandom(globalSeed) * durationRange);

            // Round to 15 min increment
            const estimatedMinutes = Math.round(duration / 15) * 15;

            //Create due date
            const dueDay = getDayInWeek(weekStart, dayOffset);
            const dueAt = setTimeOnDate(dueDay, dueHour, 0);

            //Generate assignment title
            const title = `${template.type} ${assignmentIdCounter}`;

            assignments.push({
                id: `assignment-${assignmentIdCounter++}`,
                course,
                title,
                dueAt,
                estimatedMinutes,
                status: Status.NOT_STARTED,
                color: COURSE_COLORS[course],
            });
        }
    }

    return assignments;
}

// =================================
// Schedule Block Generation
// =================================

/**
 * Finds available time slots for study blocks, avoiding fixed events
 * 
 * @param day - The day to find slots on
 * @param fixedEvents - Fixed events to avoid
 * @param preferredHours - preferred hours for scheduling
 * @returns Array of available start times
 */
function findAvailableSlots(
    day: Date,
    fixedEvents: FixedEvent[],
    preferredHours: number[],
): Date[] {

    const availableSlots: Date[] = [];

    //Checks each preferred hour
    for (const hour of preferredHours){
        // Check each 15 minute interval in the hour
        for (let minute = 0; minute < 60; minute += 15){
            const slotStart = setTimeOnDate(day, hour, minute);
            const slotEnd = addMinutes(slotStart, 60);  //Assumes 1 hr blocks

            //Check if this slot conflicts with any fixed event
            let hasConflict = false;
            for(const event of fixedEvents){
                //Check for overlap
                if(slotStart < event.endAt && slotEnd > event.startAt){
                    hasConflict = true;
                    break;
                }
            }

            if(!hasConflict){
                availableSlots.push(slotStart);
            }
        }
    }

    return availableSlots;
}

/**
 * Generates study blocks for assignments
 * Schedules blocks before assignment due dates, avoiding fixed events
 * 
 * @param assignments - Assignments to create blocks for
 * @param fixedEvents - Fixed events to avoid when scheduling
 * @param weekStart - Monday of the week
 * @returns Array of schedule blocks
 */

function generateScheduleBlocks(
    assignments: Assignment[],
    fixedEvents: FixedEvent[],
    weekStart: Date): ScheduleBlock[]{
        const blocks: ScheduleBlock[] = [];
        let blockIdCounter = 1;

        const weekDays = getWeekDays(weekStart);

        // All preferred study hours combined
        const allPreferredHours = [
            ...PREFERRED_STUDY_HOURS.morning,
            ...PREFERRED_STUDY_HOURS.afternoon,
            ...PREFERRED_STUDY_HOURS.evening,
        ];

        for (const assignment of assignments){
            let remainingMinutes = assignment.estimatedMinutes;

            //Split into blocks if needed (max 2 hours per block)
            while (remainingMinutes > 0){
                const blockDuration = Math.min(remainingMinutes, MAX_BLOCK_DURATION_MINUTES);

                //Find a suitable day (before due date)
                let scheduled = false;

                //Try to schedule on days before the due date
                for(let dayOffset = 0; dayOffset < 7; dayOffset++){
                    const day = weekDays[dayOffset];

                    //Don't schedule on or after due date
                    if(day >= assignment.dueAt){
                        break;
                    }

                    //Find available slots on this day
                    const availableSlots = findAvailableSlots(day, fixedEvents, allPreferredHours);

                    if(availableSlots.length > 0){
                        //Take the first available slot
                        const startAt = availableSlots[0];
                        const endAt = addMinutes(startAt, blockDuration);

                        blocks.push({
                            id: `block-${blockIdCounter++}`,
                            assignmentId: assignment.id,
                            title: assignment.title,
                            course: assignment.course,
                            startAt,
                            endAt,
                            locked: false,
                            status: Status.PLANNED,
                            color: assignment.color,
                        });

                        //Add this block as a temporary fixed event to avoid double booking
                        fixedEvents.push({
                            id: `temp-${blockIdCounter}`,
                            title: assignment.title,
                            category: EventCategory.EVENT,
                            startAt,
                            endAt,
                            locked: true,
                        });

                        scheduled = true;
                        remainingMinutes -= blockDuration;
                        break;
                    }
                }

                // If we couldnt schedule this block, skip it
                if(!scheduled){
                    break;
                }
            }
        }

    return blocks;
}

// =================================
// Main Generator Function
// =================================

/**
 * Generates a complete mock schedule for a given week
 * This is the main entry point for mock data generation
 * 
 * @param weekStart - Monday of the week to generate data for
 * @returns Complete schedule state with fixed events, assignments, and blocks
 */
export function generateMockWeek(weekStart: Date): Omit<ScheduleState, "currentWeek" | "selectedDay">{
    //Step 1: Generate fixed events (classes, work, sleep, personal)
    const fixedEvents = generateFixedEvents(weekStart);

    //Step 2: Generate assignments with due dates
    const assignments = generateAssignments(weekStart);

    //Step 3: Generate study blocks for assignments, avoiding fixed events
    const scheduleBlocks = generateScheduleBlocks(assignments, [...fixedEvents], weekStart);
    return{
        fixedEvents,
        assignments,
        scheduleBlocks,
    };
}

/**
 * Generates initial mock data for the application
 * Uses the current week as the starting point
 * 
 * @returns Complete initial state including current week and selected day
 */
export function generateInitialMockData(): ScheduleState{
    const now = new Date();
    const currentWeek = new Date(now);
    currentWeek.setHours(0,0,0,0);

    //Get Monday of current week
    const dayOfWeek = currentWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentWeek.setDate(currentWeek.getDate() + daysToMonday);

    const mockData = generateMockWeek(currentWeek);

    return{
        ...mockData,
        currentWeek,
        selectedDay: new Date(now), //Default to today
    };
}

