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
