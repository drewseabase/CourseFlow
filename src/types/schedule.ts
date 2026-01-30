/**
 *  Core Type Definitions for CourseFlow Schedule System
 * 
 * This file contains all TypeScript types and enums used throughout the application.
 * These types define the shape of our data for events, assignments, and schedule blocks.
 */

// =================================
// Enums
// =================================

/**
 * Category types for fixed events
 * These represent non-moveable time blocks in the schedule
 */
export enum EventCategory {
    CLASS = "class",    // Academic classes/lectures
    WORK = "work",      // Part time job or work shifts
    SLEEP = "sleep",    // Sleep blocks
    EVENT = 'event',    // Personal events (meets, gym etc)
}

/**
 * Status types for schedule blocks and assignments
 * Tracks completion state of tasks
 */

export enum Status {
    NOT_STARTED = "not_started",    // Assignment hasn't been worked on yet
    IN_PROGRESS = "in_progress",    // Assignment is being worked on
    PLANNED = "planned",            // Study block is scheduled but not done
    DONE = "done",                  // Task/block is completed
    SKIPPED = "skipped",            // Task/block was skipped for today
}

// =================================
// CORE DATA TYPES
// =================================

/**
 * FixedEvent represents immovable time blocks ( classes, work, sleep, personal)
 * These cannot be dragged or rescheduled by the user
 */

export interface FixedEvent {
    id: string;                     // Unique identifier
    title: string;                  // Display Name
    category: EventCategory;        // Type of fixed event
    startAt: Date;                  // Start time of event
    endAt: Date;                    // End time of event
    locked: true;                   // Always true for fixed events
    color?: string;                 // Optional color override for styling
}

/**
 * Assignment represents a task/homework from a course with a due date
 * Assignments generate one or more ScheduleBlocks for study time
 */

export interface Assignment{
    id: string;                     // Unique identifier
    course: string;                 // Course Name
    title: string;                  // Assignment Name
    dueAt: Date;                    // When the assignment is due
    estimatedMinutes: number;       // How long it should take
    status: Status;                 // Current completion status
    color?: string;                 // Optional color for visual grouping
}

/**
 * ScheduleBlock represents a time block allocated for working on an assignment
 * These are draggable and can be rescheduled by the user
 */

export interface ScheduleBlock{
    id: string;                     // Unique identifier
    assignmentId: string;           // References the parent Assignment.id
    title: string;                  // Display Name
    course: string;                 // Course Name
    startAt: Date;                  // Scheduled Start time
    endAt: Date;                    // Scheduled End time
    locked: boolean;                // If true, cannot be dragged
    status: Status;                 // Current status (planned/done/skipped)
    color?: string;                 // Optional color (inherited from assignment)
}

// =================================
// STATE MANAGEMENT TYPES
// =================================

/**
 * Complete application state shape
 * This is the single source of truth for all schedule data
 */

export interface ScheduleState{
    fixedEvents: FixedEvent[];          // All immovable events
    assignments: Assignment[];          // All assignments/tasks
    scheduleBlocks: ScheduleBlock[];    // All study blocks
    currentWeek: Date;                  // Monday of the week being viewed
    selectedDay: Date;                  // Day selected for "Today" view (defaults to actual today)
}

// =================================
// ACTION TYPES FOR REDUCER
// =================================

/** 
 * Action type enum for the schedule reducer
 * Defines all possible state mutations
 */

export enum ScheduleActionType{
    //Block manipulation
    MOVE_BLOCK = "MOVE_BLOCK",                  // Move a block to a new time
    ADJUST_DURATION = "ADJUST_DURATION",        // Change block duration (+/- 15 mins)
    TOGGLE_LOCK = "TOGGLE_LOCK",                // Lock/unlock a block

    //Status updates
    MARK_DONE = "MARK_DONE",                    // Mark block as complete
    SKIP_BLOCK = "SKIP_BLOCK",                  // Mark block as skipped

    //Navigation    
    SET_CURRENT_WEEK = "SET_CURRENT_WEEK",      // Change which week is displayed
    SET_SELECTED_DAY = "SET_SELECTED_DAY",      // Change which day is selected for Today view

    //Initialization
    LOAD_MOCK_DATA = "LOAD_MOCK_DATA",          //Load initial mock data
}

/**
 * Action to move a schedule block to a new time
 */

export interface MoveBlockAction {
    type: ScheduleActionType.MOVE_BLOCK;
    payload: {
        blockId: string;        // Which block to move
        newStartAt: Date;       //New start time (end time calcualted from duration)
    };
}

/**
 * Action to adjust the duration of a schedule block
 */

export interface AdjustDurationAction{
    type: ScheduleActionType.ADJUST_DURATION;
    payload: {
        blockId: string;            // Which block to adjust
        minutesDelta: number;       // How many minutes to add/subtract (typically +15 or -15)
    };
}

/**
 * Action to toggle the locked state of a schedule block
 */

export interface ToggleLockAction{
    type: ScheduleActionType.TOGGLE_LOCK;
    payload:{
        blockId: string;            // Which block to mark complete
    };
}

/**
 * Action to mark a schedule block as done
 */
export interface MarkDoneAction {
  type: ScheduleActionType.MARK_DONE;
  payload: {
    blockId: string; // Which block to mark complete
  };
}

/**
 * Action to mark a schedule block as skipped
 */

export interface SkipBlockAction{
    type: ScheduleActionType.SKIP_BLOCK;
    payload:{
        blockId: string;           // Which block to skip
    };
}

/**
 * Action to change the current week being viewed
 */

export interface SetCurrentWeekAction{
    type: ScheduleActionType.SET_CURRENT_WEEK;
    payload: {
        weekStart: Date;            //Monday of the new week to display
    };
}

/**
 * Action to change the selected day for Today view
 */

export interface SetSelectedDayAction{
    type: ScheduleActionType.SET_SELECTED_DAY;
    payload: {
        day: Date;      // The new selected day
    };
}

/**
 * Action to load mock data into state
 */

export interface LoadMockDataAction{
    type: ScheduleActionType.LOAD_MOCK_DATA;
    payload: {
        state: ScheduleState;       //Complete state to load
    };
}

/**
 * Union type of all possible actions
 * This ensures type safety in the reducer
 */
export type SchedyleAction = 
| MoveBlockAction
| AdjustDurationAction 
| ToggleLockAction
| MarkDoneAction
| SkipBlockAction
| SetCurrentWeekAction
| SetSelectedDayAction
| LoadMockDataAction;

// =================================
// Utility Types
// =================================

/** 
 * Represents a time slot in the calendar grid
 * Used for rendering and collision detection
 */

export interface TimeSlot{
    hour: number;       // 0-23
    minute: number;     // 0,15,30,45
}

/**
 * Represents a day in the week with its events
 * Used for organizing data by day
 */

export interface DaySchedule{
    date: Date;                         // The date for this day
    fixedEvents: FixedEvent[];          // Fixed events on this day
    scheduleBlocks: ScheduleBlock[];    // Study blocks on this day
}