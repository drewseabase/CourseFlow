/**
 * Time Utility Functions
 * 
 * This module provides core time manipulation functions for the schedule system
 * Snapping times to 15-min intervals
 * Detecting overlaps between events
 * Converting between time formats and grid positions
 * Calculating durations
 */

import {FixedEvent, ScheduleBlock, TimeSlot } from "@/types/schedule";

// =================================
// Constants
// =================================

/**
 * Time interval in minutes for snapping and grid calculations
 * All times snap to 15 minute boundaries
 * Includes: Num minutes in an hr, num intervals per hr
 * num hours in a day, num of total slots in a day
 */

export const INTERVAL_MINUTES = 15;
export const MINUTES_PER_HOUR = 60; 
export const INTERVALS_PER_HOUR = MINUTES_PER_HOUR / INTERVAL_MINUTES;
export const TOTAL_HOURS = 24;
export const TOTAL_SLOTS = TOTAL_HOURS * INTERVALS_PER_HOUR;


// =================================
// Time Snapping
// =================================

/**
 * Snaps a date to the nearest 15-minute interval
 * 
 * @param date - The date/time to snap
 * @returns A new date snapped to the nearest 15 minute mark
 */
export function snapToInterval (date: Date): Date {
    const minutes = date.getMinutes();
    const remainder = minutes % INTERVAL_MINUTES;

    //Round to nearest interval
    let snappedMinutes: number;
    if(remainder < INTERVAL_MINUTES / 2){
        //Round down
        snappedMinutes = minutes - remainder;
    }else{
        //Round up
        snappedMinutes = minutes + (INTERVAL_MINUTES - remainder);
    }
    
    const snapped = new Date(date);
    snapped.setMinutes(snappedMinutes);
    snapped.setSeconds(0);
    snapped.setMilliseconds(0);

    return snapped;
}

/**
 * Snaps a Date down to the previous 15-minute interval
 * Useful for drag start positions
 * 
 * @param date - The date/time to snap
 * @return A new date snapped down to the previous 15-minute mark
 */

export function snapDownToInterval(date: Date): Date {
    const minutes = date.getMinutes();
    const remainder = minutes % INTERVAL_MINUTES;
    const snappedMinutes = minutes - remainder;

    const snapped = new Date(date);
    snapped.setMinutes(snappedMinutes);
    snapped.setSeconds(0);
    snapped.setMilliseconds(0);

    return snapped;
}


// =================================
// Duration Calculations
// =================================

/**
 * Calculates the duration in minutes between two dates
 * 
 * @param startAt - Start time
 * @param endAt - End time
 * @returns Duration in minutes
 */

export function calculateDuration(startAt: Date, endAt: Date): number{
    const diff = endAt.getTime() - startAt.getTime();
    return Math.round(diff / (1000 * 60));  //Convert milliseconds to minutes
}

/**
 * Adds minutes to a date and returns a new Date
 * 
 * @param date - The starting date
 * @param minutes - Number of minutes to add (can be negative)
 * @returns A new Date with the minutes added
 */

export function addMinutes(date: Date, minutes: number): Date{
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
}


// =================================
// OverLap Detection
// =================================

/**
 * Checks if two time ranges overlap
 * 
 * Two ranges overlap if: 
 * Range A starts before Range B ends, AND
 * range A ends after Range B starts
 * 
 * @param start1 - Start of first range
 * @param end1 - End of first range
 * @param start2 - Start of second range
 * @param end2 - End of second range
 * @returns true if the ranges overlap, false otherwise
 */

export function checkTimeOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date): boolean {
    return start1 < end2 && end1 < start2;
}

/**
 * Checks if a schedule block would overlap with any fixed events
 * 
 * @param blockStart - proposed start time for the block
 * @param blockEnd - proposed end time for the block
 * @param fixedEvents - Array of fixed events to check against
 * @param excludeBlockID - option block ID to exclude from checking
 * @returns The first overlapping fixed event or null if no overlap
 */

export function checkOverlapWithFixed(
    blockStart: Date,
    blockEnd: Date,
    fixedEvents: FixedEvent[],
    excludeBlockID?: string): FixedEvent | null {
        for(const event of fixedEvents){
            if(checkTimeOverlap(blockStart, blockEnd, event.startAt, event.endAt)){
                return event;
            }
        }
        return null;
    }

/**
 * Checks if a schedule block would overlap with any other schedule blocks
 * 
 * @param blockStart - Proposed start time for the block
 * @param blockEnd - Proposed end time for the block
 * @param scheduleBlocks - Array of schedule blocks to check against
 * @param excludeBlockID - Block ID to exclude from checking
 * @returns The first overlapping schedule block, or null if no overlap
 */

export function checkOverlapWithBlocks(
    blockStart: Date,
    blockEnd: Date,
    scheduleBlocks: ScheduleBlock[],
    excludeBlockId: string): ScheduleBlock | null {
        for(const block of scheduleBlocks){
            //Skip the block being moved
            if(block.id === excludeBlockId){
                continue;
            }

            if( checkTimeOverlap(blockStart, blockEnd, block.startAt, block.endAt)){
                return block;
            }
        }
        return null;
    }


// =================================
// Grid Position Calculations
// =================================

