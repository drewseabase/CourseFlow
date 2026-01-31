/**
 * Schedule Reducer
 * 
 * This reducer handles all state updates for the schedule system.
 * It processes actions dispatched from components and returns a new state.
 * 
 * IMPORTANT: this reducer follows immutability principles - it never mutates the
 * existing state, but instead returns a new state object
 */

import { ScheduleState, ScheduleAction, ScheduleActionType, Status } from "@/types/schedule";
import { addMinutes, calculateDuration } from "@/lib/utils/time";

/**
 * Main reducer function for schedule state management
 * 
 * @param state - Current State
 * @param action - Action process
 * @returns New state after applying the action
 */
export function scheduleReducer(
    state: ScheduleState, action: ScheduleAction): ScheduleState {

    switch(action.type){
        // =====================================================
        // MOVE_BLOCK: Update a blocks position in the calendar
        // =====================================================
            
        case ScheduleActionType.MOVE_BLOCK:{
            const {blockId, newStartAt} = action.payload;

            return {
                ...state,
                scheduleBlocks: state.scheduleBlocks.map((block) =>{
                    if (block.id !== blockId){
                        return block;
                    }

                    // Calculate new end time (maintain duration)
                    const duration = calculateDuration(block.startAt, block.endAt);
                    const newEndAt = addMinutes(newStartAt, duration);

                    //Return updated block
                    return{
                        ...block,
                        startAt: newStartAt,
                        endAt: newEndAt,
                    };
                }),
            };
        }

        // =======================================================================
        // ADJUST_DURATION: Change a blocks duration by adding/subtracting minutes
        // =======================================================================
        case ScheduleActionType.ADJUST_DURATION:{
            const{blockId, minutesDelta} = action.payload;

            return{
                ...state,
                scheduleBlocks: state.scheduleBlocks.map((block) =>{
                    if(block.id !== blockId){
                        return block;
                    }

                    //Calculate new end time
                    const newEndAt = addMinutes(block.endAt, minutesDelta);

                    //Don't allow duration to go below 15 minutes
                    const newDuration = calculateDuration(block.startAt, newEndAt);
                    if(newDuration < 15){
                        //Return unchanged if duration would be too short
                        return block;
                    }

                    //return updated block with new end time
                    return{
                        ...block,
                        endAt: newEndAt,
                    };
                }),
            };
        }

        // =======================================================================
        // TOGGLE_LOCK: Lock or unlock a schedule block
        // =======================================================================
        case ScheduleActionType.TOGGLE_LOCK:{
            const {blockId} = action.payload;

            return {
                ...state,
                scheduleBlocks: state.scheduleBlocks.map((block) =>{
                    if(block.id !== blockId){
                        return block;
                    }

                    //Toggle locked state
                    return {
                        ...block,
                        locked: !block.locked,
                    };
                }),
            };
        }

        // =======================================================================
        // MARK_DONE: Set a block's status to done
        // =======================================================================
        case ScheduleActionType.MARK_DONE:{
            const {blockId} = action.payload;

            return{
                ...state,
                scheduleBlocks: state.scheduleBlocks.map((block)=>{
                    if(block.id !== blockId){
                        return block;
                    }

                    //Update status to done
                    return{
                        ...block,
                        status: Status.DONE,
                    };
                }),
            };
        }

        // =======================================================================
        // SKIP_BLOCK: Set a block's status to skipped
        // =======================================================================
        case ScheduleActionType.SKIP_BLOCK:{
            const {blockId} = action.payload;

            return{
                ...state,
                scheduleBlocks: state.scheduleBlocks.map((block) =>{
                    if(block.id !== blockId){
                        return block;
                    }

                    //Update status to skipped
                    return{
                        ...block,
                        status: Status.SKIPPED,
                    };
                }),
            };
        }

        // =======================================================================
        // SET_CURRENT_WEEK: Change which week is being viewed on the calendar
        // =======================================================================
        case ScheduleActionType.SET_CURRENT_WEEK:{
            const {weekStart} = action.payload;

            return{
                ...state,
                currentWeek: weekStart,
            };
        }

        // =======================================================================
        // SKIP_SELECTED_DAY: Change which day is selected for Today view
        // =======================================================================
        case ScheduleActionType.SET_SELECTED_DAY:{
            const {day} = action.payload;

            return{
                ...state,
                selectedDay: day,
            };
        }

        // =======================================================================
        // LOAD_MOCK_DATA: Replace entire state with new mock data
        // =======================================================================
        case ScheduleActionType.LOAD_MOCK_DATA:{
            const{state: newState} = action.payload;

            //Replace entire state
            return newState;
        }

        // ===================================
        // DEFAULT: Unknown action type
        // ===================================
        default:{
            //TypeScript exhaustiveness check
            //If we get here, we forgot to handle an action type
            const _exhaustiveCheck: never = action;
            return state;
        }
    }
}