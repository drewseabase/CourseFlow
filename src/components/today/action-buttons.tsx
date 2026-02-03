/**
 * ActionButton Components
 * 
 * Provides action buttons for a task/schedule block in the Today view:
 * - Mark done
 * - Skip
 * - Lock/Unlock
 * - Adjust duration
 * 
 * These buttons allow users to quickly update block status and timing
 */
"use client";

import React from "react";
import { ScheduleBlock, Status } from "@/types/schedule";
import { Button } from "../ui/button";
import { Check, X, Lock, Unlock, Minus, Plus } from "lucide-react";
import { useSchedule } from "@/hooks/use-schedule";

/**
 * Props for ActionButtons component
 */
interface ActionButtonsProps{
    block: ScheduleBlock;
}

/**
 * ActionButtons Component
 * 
 * Renders a set of action buttons for managing a schedule block.
 * Each button triggers the appropriate state update via the schedule context
 * 
 * @param props - Component props
 * @returns Rendered action buttons
 */
export function ActionButtons({block}: ActionButtonsProps){
    const {actions} = useSchedule();

    //Determine if block is already done or skipped
    const isDone = block.status === Status.DONE;
    const isSkipped = block.status === Status.SKIPPED;
    const isLocked = block.locked;

    /**
     * Handles marking the block as done
     */
    const handleMarkDone = () => {
        actions.markDone(block.id);
    };

    /**
     * Handles marking the block as skipped
     */
    const handleSkip = () => {
        actions.skipBlock(block.id);
    };

    /**
     * Handles toggling the lock state
     */
    const handleToggleLock = () =>{
        actions.toggleLock(block.id);
    };

    /**
     * Handles decreasing duration by 15 minutes
     */
    const handleDecreasingDuration = () => {
        actions.adjustDuration(block.id, -15);
    };

    /**
     * Handles increasing duration by 15 minutes
     */
    const handleIncreasingDuration = () => {
        actions.adjustDuration(block.id, 15);
    };

 return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Done button */}
      <Button
        size="sm"
        variant={isDone ? "default" : "outline"}
        onClick={handleMarkDone}
        disabled={isDone}
        className={isDone ? "bg-green-600 hover:bg-green-700" : ""}
      >
        <Check className="w-4 h-4 mr-1" />
        {isDone ? "Done" : "Mark Done"}
      </Button>
      
      {/* Skip button */}
      <Button
        size="sm"
        variant={isSkipped ? "default" : "outline"}
        onClick={handleSkip}
        disabled={isSkipped}
        className={isSkipped ? "bg-orange-600 hover:bg-orange-700" : ""}
      >
        <X className="w-4 h-4 mr-1" />
        {isSkipped ? "Skipped" : "Skip"}
      </Button>
      
      {/* Lock/Unlock button */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleToggleLock}
        title={isLocked ? "Unlock (enable dragging)" : "Lock (disable dragging)"}
      >
        {isLocked ? (
          <>
            <Unlock className="w-4 h-4 mr-1" />
            Unlock
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-1" />
            Lock
          </>
        )}
      </Button>
      
      {/* Divider */}
      <div className="h-6 w-px bg-gray-300" />
      
      {/* Duration adjustment buttons */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDecreasingDuration}
          title="Took 15 minutes less"
          className="px-2"
        >
          <Minus className="w-4 h-4" />
          <span className="ml-1 text-xs">15m</span>
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleIncreasingDuration}
          title="Took 15 minutes more"
          className="px-2"
        >
          <Plus className="w-4 h-4" />
          <span className="ml-1 text-xs">15m</span>
        </Button>
      </div>
    </div>
  );
}