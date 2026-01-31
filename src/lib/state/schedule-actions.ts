/**
 * Schedule Action Creators
 * 
 * This module provides type-safe action creator functions for dispatching state updates
 * to the schedule reducer. Using these functions ensures 
 * we don't make typos in action types and payloads 
 */

import { ScheduleAction, ScheduleActionType,
    MoveBlockAction, AdjustDurationAction, ToggleLockAction, MarkDoneAction, SkipBlockAction,
    SetCurrentWeekAction, SetSelectedDayAction, LoadMockDataAction, ScheduleState,
 } from "@/types/schedule";


// =================================
// Block Manipulation Actions
// =================================

/**
 * Creates an action to move a schedule block to a new time
 * 
 * @param blockId - ID of the block to move
 * @param newStartAt - New start time for the block
 * @returns Action object for the reducer
 */

export function moveBlock(blockId: string, newStartAt: Date) :MoveBlockAction {
    return{
        type: ScheduleActionType.MOVE_BLOCK,
        payload:{
            blockId,
            newStartAt,
        },
    };
}

/**
 * Creates an action to adjust the duration of a schedule block
 * Typically used for +15/-15 minute adjustments from the Today view
 * 
 * @param blockId - ID of the block to adjust
 * @param minutesDelta - number of minutes to add (positive) or subtract (negative)
 * @returns Action object for the reducer
 */

export function adjustDuration(blockId: string, minutesDelta: number): AdjustDurationAction{
    return {
        type: ScheduleActionType.ADJUST_DURATION,
        payload:{
            blockId,
            minutesDelta,
        },
    };
}

/**
 * Creates an action to toggle the locked state of a schedule block
 * Locked blocks cannot be dragged in the calendar
 * 
 * @param blockId - ID of the block to lock/unlock
 * @returns Action object for the reducer
 */
export function toggleLock(blockId: string): ToggleLockAction{
    return{
        type: ScheduleActionType.TOGGLE_LOCK,
        payload:{
            blockId,
        },
    };
}

// =================================
// Status Update Actions
// =================================

/**
 * Creates an action to mark a schedule block as done
 * 
 * @param blockId - ID of the block to mark complete
 * @returns Action object for the reducer
 */
export function markDone(blockId: string): MarkDoneAction{
    return{
        type: ScheduleActionType.MARK_DONE,
        payload:{
            blockId,
        },
    };
}

/**
 * Creates an action to mark a schedule block as skipped
 * 
 * @param blockId - ID of the block to skip
 * @returns Action object for the reducer
 */
export function skipBlock(blockId: string): SkipBlockAction{
    return{
        type: ScheduleActionType.SKIP_BLOCK,
        payload: {
            blockId,
        },
    };
}

// =================================
// Navigation Actions
// =================================

/**
 * Creates an action to change the current week being viewed
 * This is used by the prev/next week navigation buttons
 * 
 * @param weekStart - Monday of the new week to display
 * @returns Action object for the reducer
 */
export function setCurrentWeek(weekStart: Date): SetCurrentWeekAction{
    return{
        type: ScheduleActionType.SET_CURRENT_WEEK,
        payload:{
            weekStart,
        },
    };
}

/**
 * Creates an action to change the selected day (for Today view)
 * This is called when the user clicks a day in the calendar
 * 
 * @param day - The new selected day
 * @returns Action object for the reducer
 */

export function setSelectedDay(day: Date): SetSelectedDayAction{
    return{
        type: ScheduleActionType.SET_SELECTED_DAY,
        payload: {
            day,
        },
    };
}

// =================================
// Data Loading Actions
// =================================

/**
 * Creates an action to load mock data into state
 * This is used when navigating to a new week or resetting data
 * 
 * @param state - Complete state to load
 * @returns Action object for the reducer
 */
export function loadMockData(state: ScheduleState): LoadMockDataAction{
    return{
        type: ScheduleActionType.LOAD_MOCK_DATA,
        payload: {
            state,
        },
    };
}