/**
 * TaskItem Component
 * 
 * Displays a single schedule block/task in the Today view
 * Shows all relevant information and provides action buttons
 * 
 * Includes:
 * - Task title and course
 * - Time range
 * - Duration
 * - Status indicator
 * - Lock indicator
 * - Action buttons
 */

"use client";

import React from "react";
import { ScheduleBlock, Status } from "@/types/schedule";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ActionButtons } from "./action-buttons";
import { formatTimeRange, formatDuration } from "@/lib/utils/time";
import {Lock, Check, Minus, Clock} from "lucide-react";

/**
 * Props for TaskItem component
 */
interface TaskItemProps {
    block: ScheduleBlock;
}

/**
 * TaskItem component
 * 
 * Renders a single task/block with all its details and actions
 * Uses Card component for visual structure
 * 
 * @param props- Component props
 * @returns Rendered task item
 */
export function TaskItem({block}: TaskItemProps){
    //Calculate duration in minutes
    const durationMinutes = Math.round(block.endAt.getTime() - block.startAt.getTime()) / (1000 * 60);

    //Determines status styling and label
    const statusConfig = getStatusConfig(block.status);

    return(
            <Card className="p-4">
      <div className="space-y-3">
        {/* Header row: Title, course, and status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Task title */}
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {block.title}
            </h3>
            
            {/* Course name */}
            <p className="text-sm text-indigo-600 font-medium mt-0.5">
              {block.course}
            </p>
          </div>
          
          {/* Status badge */}
          <Badge
            variant={statusConfig.variant}
            className={statusConfig.className}
          >
            {statusConfig.icon}
            <span className="ml-1">{statusConfig.label}</span>
          </Badge>
        </div>
        
        {/* Time and duration info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {/* Time range */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{formatTimeRange(block.startAt, block.endAt)}</span>
          </div>
          
          {/* Duration */}
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Duration:</span>
            <span>{formatDuration(durationMinutes)}</span>
          </div>
          
          {/* Lock indicator */}
          {block.locked && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <Lock className="w-4 h-4" />
              <span className="text-xs">Locked</span>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="pt-2 border-t border-gray-200">
          <ActionButtons block={block} />
        </div>
      </div>
    </Card>
    );
}

/**
 * Gets the configuration for status display
 * Returns icon, label, badge variant, and className
 */
function getStatusConfig(status: Status){
    switch(status){
        case Status.DONE:
            return{
                icon: <Check className="w-3 h-3"/>,
                label: "Done",
                variant: "default" as const,
                className: "bg-green-600 hover:bg-green-700",
            };
        case Status.SKIPPED:
            return{
                icon: <Minus className="w-3 h-3"/>,
                label: "Skipped",
                variant: "default" as const,
                className: "bg-orange-600 hover:bg-orange-700",
            };
        case Status.PLANNED:
            default:
                return{
                    icon: <Clock className="w-3 h-3"/>,
                    label: "Planned",
                    variant: "outline" as const,
                    className: "border-indigo-300 text-indigo-700",
                };
                
    }
}