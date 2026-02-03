/**
 * TaskList Component
 * 
 * Displays a list of all schedule blocks for the selected day.
 * Sorts blocks by start time and shows an empty state if no blocks exist
 * 
 * This is the main content component of the Today view.
 */
"use client";

import React from "react";
import { ScheduleBlock } from "@/types/schedule";
import { TaskItem } from "./task-item";
import { CalendarX } from "lucide-react";

/**
 * Props for Tasklist component
 */
interface TaskListProps {
    blocks: ScheduleBlock[];
}

/**
 * TaskList component
 * 
 * Renders a list of task items sorted by start time
 * Shows an empty state when there are no blocks
 * 
 * @param props - Component props
 * @returns Rendered task list
 */
export function TaskList ({blocks} : TaskListProps){
    // Sorted blocks by start time
    const sortedBlocks = [...blocks].sort(
        (a,b) => a.startAt.getTime() - b.startAt.getTime()
    );

    // Show empty state if no blocks
    if(sortedBlocks.length === 0){
        return(
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <CalendarX className="w-12 h-12 text-gray-400"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No study blocks scheduled
                </h3>
                <p className="text-gray-600 max-w-md">
                    You don't have any study blocks planned for this day.
                    Enjoy your free time or add blocks in the calendar view!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedBlocks.map((block) =>(
                <TaskItem key={block.id} block={block}/>
            ))}
        </div>
    );
}