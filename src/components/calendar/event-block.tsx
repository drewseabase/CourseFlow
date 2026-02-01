/**
 * Event Block Component
 * 
 * Renders an individual event or schedule block in the calendar.
 * Handles both fixed events (classes, work, sleep) and study blocks.
 * 
 * Features:
 * - Different styling for fixed vs. study blocks
 * - Status indicators (done, skipped)
 * - Lock icon for locked blocks
 * - Will support drag & drop 
 */
"use client";
import React from "react";
import { FixedEvent, ScheduleBlock, EventCategory, Status } from "@/types/schedule";
import { calculateDuration} from "@/lib/utils/time";
import { Lock, Minus, BookOpen, Briefcase, Moon, Calendar} from "lucide-react";
import { formatTime } from "@/lib/utils/date-helpers";

/**
 * Props for EventBlock component
 */
interface EventBlockProps{
    event: FixedEvent | ScheduleBlock;
    style?: React.CSSProperties;
    onClick?: () => void;
    onDragStart?: (block: ScheduleBlock, e: React.DragEvent) => void;
    onDragEnd?: (e: React.DragEvent) => void;
}

/**
 * Type guard to check if an event is a ScheduleBlock
 */
function isScheduleBlock(
    event: FixedEvent | ScheduleBlock
): event is ScheduleBlock {
    return "assignmentId" in event;
}

/**
 * EventBlock component
 * 
 * Displays a single event or study block with appropriate styling and icons.
 * Position and size are controlled via the style prop (set by parent).
 * 
 * @param props - Component props
 * @returns Rendered event block
 */
export function EventBlock({ event, style, onClick, onDragStart, onDragEnd}: EventBlockProps){
    const isBlock = isScheduleBlock(event);
    const isFixed = !isBlock;
    const isLocked = event.locked;

    //Calculate duration for display
    const durationMinutes = calculateDuration(event.startAt, event.endAt);
    const durationText = formatDurationShort(durationMinutes);

    //Determine styling based on event type and status
    const baseClasses = "absolute rounded-lg border-2 p-2 overflow-hidden transition-all";

    //Fixed event: Gray background, solid border
    const fixedClasses = "bg-gray-100 border-gray-300 text-gray-700";

    //Study blocks: Blue/purple gradient, dashed border (when not done/skipped)
    const blockClasses = "bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-300 border-dashed text-indigo-900";

    //Status-based styling
    let statusClasses = "";
    if(isBlock){
        const block = event as ScheduleBlock;
        if(block.status === Status.DONE){
            statusClasses = "bg-green-50 border-green-400 border-solid opacity-75";
        }else if (block.status === Status.SKIPPED){
            statusClasses = "bg-orange-50 border-orange-400 border-solid opacity-75";
        }
    }

    //Cursor styling
    const cursorClass = isFixed || isLocked ? "cursor-default" : "cursor-move hover:shadow-md";

    //Get icon for event type
    const Icon = getEventIcon(event, isBlock);

    //Determine if this block is draggable
    const isDraggable = isBlock && !isLocked;

    //Drag event handlers
    const handleDragStart = (e: React.DragEvent) => {
        if(isDraggable && onDragStart) {
            onDragStart(event as ScheduleBlock, e);
        }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        if(isDraggable && onDragEnd){
            onDragEnd(e);
        }
    };

    return (
        <div className = {`${baseClasses} ${isFixed ? fixedClasses : blockClasses} ${statusClasses}
        ${cursorClass}`}
        style = {style}
        onClick = {onClick}
        draggable = {isDraggable}
        onDragStart = {handleDragStart}
        onDragEnd = {handleDragEnd}
        title={`${event.title} (${formatTime(event.startAt)} - ${formatTime(event.endAt)})`}>

            {/*Top row: Icon and title*/}
            <div className="flex items-start justify-betwen gap-1 mb-1">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                    <Icon className="w-3 h-3 flex-shrink-0" />
                    <span className = "text-xs font-semibold truncate leading-tight">
                        {event.title}
                    </span>
                </div>

                {/*Lock icon for locked blocks*/}
                {isLocked && <Lock className="w-3 h-3 flex-shrink-0 text-gray-500"/>}
            </div>

            {/* Time and duration */}
            <div className = "text-xs text-gray-600 leading-tight">
                {formatTime(event.startAt)}
            </div>
            <div className="text-xs text-gray-500 leading-tight">
                {durationText}
            </div>

            {/* Course name for study blocks */}
            {isBlock && (
                <div className="text-xs text-indigo-600 font-medium mt-1 truncate">
                    {(event as ScheduleBlock).course}
                </div>
            )}

            {/* Status indicator overlay */}
            {isBlock && renderStatusIndicator(event as ScheduleBlock)}
        </div>
    );
}

/**
 * Gets the appropriate icon for an event type
 */
function getEventIcon(event: FixedEvent | ScheduleBlock, isBlock: boolean){
    if(isBlock){
        return BookOpen;
    }

    const fixedEvent = event as FixedEvent;
    switch(fixedEvent.category){
        case EventCategory.CLASS:
            return BookOpen;
        case EventCategory.WORK:
            return Briefcase;
        case EventCategory.SLEEP:
            return Moon;
        case EventCategory.EVENT:
            return Calendar;
        default:
            return Calendar;
    }
}

/**
 * Renders a status indicator for completed or skipped blocks
 */
function renderStatusIndicator(block: ScheduleBlock){
    if(block.status === Status.DONE){
        return(
            <div className = "absolute top-1 right-1 bg-orange-500 rounded-full p-0.5">
                <Minus className="w-3 h-3 text-white"/>
            </div>
        );
    }

    return null;
}

/**
 * Formats duration in a short format
 * 
 * Examples:
 * - 30 -> "30m"
 * - 90 -> "1.5h"
 * - 120 -> "2h"
 */
function formatDurationShort(minutes: number): string{
    if(minutes < 60){
        return `${minutes}m`;
    }

    const hours = minutes / 60;
    if(hours % 1 === 0){
        return `${hours}h`;
    }

    return `${hours.toFixed(1)}h`;
}