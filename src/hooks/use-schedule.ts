/**
 * useSchedule Hook
 * 
 * Custom React hook for accessing the schedule context.
 * This hook provides both the current state and convenient helper functions
 * for dispatching common actions
 * 
 * Usage:
 * ```tsx
 * const {state, dispatch, actions} = useSchedule();
 * 
 * //Access state
 * const {scheduleBlocks, currentWeek} = state;
 * 
 * // Use helper actions
 * actions.moveBlock(blockId, newStartTime);
 * actions.markDone(blockId);
 * ```
 */

"use client";

import { useContext } from "react";
import { ScheduleContext } from "@/lib/state/schedule-context";
import { ScheduleState, ScheduleAction } from "@/types/schedule";
import * as actionCreators from "@/lib/state/schedule-actions";

// =========================================
// Hook Return Type
// =========================================

/**
 * Return type of the useSchedule hook
 * Provides state, dispatch, and convenient action helpers
 */
interface UseScheduleReturn{
    //Raw state and dispatch for maximum flexibility
    state: ScheduleState;
    dispatch: React.Dispatch<ScheduleAction>;

    //Convenient Action helper functions
    actions: {
        moveBlock: (blockId: string, newStartAt: Date) => void;
        adjustDuration: (blockId: string, minutesDelta: number) => void;
        toggleLock: (blockId: string) => void;
        markDone: (blockId: string) => void;
        skipBlock: (blockId: string) => void;
        setCurrentWeek: (weekStart: Date) => void;
        setSelectedDay: (day: Date) => void;
        loadMockData: (state: ScheduleState) => void;
    };
}

// =========================================
// Hook Implementation
// =========================================

/**
 * useSchedule hook
 * 
 * Provides access to the schedule state and dispatch function.
 * Must be used within a ScheduleProvider component tree.
 * 
 * @throws Error if used outside of ScheduleProvider
 * @returns Object containing state, dispatch, and action helpers
 */
export function useSchedule(): UseScheduleReturn{
    //Get context value
    const context = useContext(ScheduleContext);

    //Throw error if context is not available (used outside provider)
    if(context === undefined){
        throw new Error(
            "useSchedule must be within a ScheduleProvider. " +
            "Make sure your component is wrapper with <ScheduleProvider>."
        );
    }

    const {state, dispatch} = context;

    //Create convenient action helper functions
    // These wrap the action creators and automatically dispatch the actions
    const actions = {
        /**
         * Move a schedule block to a new time
         */
        moveBlock: (blockId: string, newStartAt: Date) =>{
            dispatch(actionCreators.moveBlock(blockId, newStartAt));
        },

        /**
         * Adjust the duration of a schedule block
         */
        adjustDuration: (blockId: string, minutesDelta: number) => {
            dispatch(actionCreators.adjustDuration(blockId, minutesDelta));
        },

        /**
         * Toggle the locked state of a schedule block
         */
        toggleLock: (blockId: string) =>{
            dispatch(actionCreators.toggleLock(blockId));
        },

        /**
         * Mark a schedule block as done
         */
        markDone: (blockId: string) =>{
            dispatch(actionCreators.markDone(blockId));
        },

        /**
         * Mark a schedule block as skipped
         */
        skipBlock: (blockId: string) =>{
            dispatch(actionCreators.skipBlock(blockId));
        },

        /**
         * Change the current week being viewed
         */
        setCurrentWeek: (weekStart: Date) =>{
            dispatch(actionCreators.setCurrentWeek(weekStart));
        },

        /**
         * Change the selected day (for Today view)
         */
        setSelectedDay: (day: Date)=>{
            dispatch(actionCreators.setSelectedDay(day));
        },

        /**
         * Load new Mock data
         */
        loadMockData:(newState: ScheduleState) =>{
            dispatch(actionCreators.loadMockData(newState));
        },
    };

    return{
        state,
        dispatch,
        actions,
    };
}