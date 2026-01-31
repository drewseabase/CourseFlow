/**
 * Schedule Context Provider
 * 
 * This module provides React context for sharing schedule states across
 * the entire application. It uses useReducer for state management and makes both state and
 * dispatch available to all child components
 * 
 * Usage:
 * 1. Wrap your app with <ScheduleProvider>
 * 2. Use the useSchedule() hook in any component to access state/dispatch
 */

"use client";

import React, {createContext, useReducer, ReactNode} from "react";
import { ScheduleState, ScheduleAction } from "@/types/schedule";
import { scheduleReducer } from "./schedule-reducer";
import { generateInitialMockData } from "../mock/generator";

// ======================================
// Context Type Definition
// ======================================

/**
 * Shape of the context value
 * Provides both the current state and dispatch function for updates
 */
interface ScheduleContextValue {
    state: ScheduleState;
    dispatch: React.Dispatch<ScheduleAction>;
}

// =========================================
// Context Creation
// =========================================

/**
 * The Schedule Context
 * Initially undefined - will be set by the provider
 */
export const ScheduleContext = createContext<ScheduleContextValue | undefined>(
    undefined
);

// =========================================
// Provider Component
// =========================================

/**
 * Props for the ScheduleProvider component
 */

interface ScheduleProviderProps{
    children: ReactNode;
}

/**
 * ScheduleProvider component
 * 
 * Wraps the application (or part of it) and provides schedule state
 * to all child components via React Context.
 * 
 * Features:
 * - Initializes state with mock data
 * - Provides dispatch function for state updates
 * - Makes state available throughout component tree
 * 
 * @param props - Component props
 * @returns Provider component wrapping children
 */
export function ScheduleProvider({children}: ScheduleProviderProps){
    //Initialize state with mock data for current week
    //This runs only once when the provider mounts
    const initialState = generateInitialMockData();

    // Set up reducer with initial state
    const [state, dispatch] = useReducer(scheduleReducer, initialState);

    // Create context value object
    const value: ScheduleContextValue = {
        state, 
        dispatch,
    };

    //Provides the context to all children
    return(
        <ScheduleContext.Provider value = {value}>
            {children}
        </ScheduleContext.Provider>
    );
}
