/**
 * useDragDrop Hook
 * 
 * Custom hook that encapsulates drag-and-drop logic for schedule blocks.
 * Handles:
 * - Drag start/end events
 * - Drop validation (overlap detection)
 * - State updates on successful drop
 * - Error handling and user feedback
 * 
 * This hook makes EventBlock and DayColumn components simpler by
 * centralizing all drag/drop logic.
 */

"use client";

import { useState, useCallback } from "react";
import { useSchedule } from "./use-schedule";
import { ScheduleBlock } from "@/types/schedule";
import {
  calculateDuration,
  addMinutes,
  checkOverlapWithFixed,
  snapToInterval,
  isSameDay,
} from "@/lib/utils/time";
import {toast} from "sonner";
/**
 * State for the currently dragging block
 */
interface DragState {
  blockId: string;
  originalStartAt: Date;
  duration: number;
}

/**
 * Return type of useDragDrop hook
 */
interface UseDragDropReturn {
  // Current drag state
  isDragging: boolean;
  draggingBlockId: string | null;
  
  // Event handlers for draggable blocks
  handleDragStart: (block: ScheduleBlock, e: React.DragEvent) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  
  // Event handlers for drop zones (day columns)
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (date: Date, e: React.DragEvent) => void;
}

/**
 * useDragDrop hook
 * 
 * Provides drag-and-drop functionality for schedule blocks.
 * 
 * Usage in EventBlock:
 * ```tsx
 * const { handleDragStart, handleDragEnd } = useDragDrop();
 * <div draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
 * ```
 * 
 * Usage in DayColumn:
 * ```tsx
 * const { handleDragOver, handleDrop } = useDragDrop();
 * <div onDragOver={handleDragOver} onDrop={handleDrop}>
 * ```
 * 
 * @returns Drag/drop handlers and state
 */
export function useDragDrop(): UseDragDropReturn {
  const { state, actions } = useSchedule();
  const [dragState, setDragState] = useState<DragState | null>(null);
  
  /**
   * Handles drag start event
   * Stores the block being dragged and its original position
   */
  const handleDragStart = useCallback(
    (block: ScheduleBlock, e: React.DragEvent) => {
      // Don't allow dragging locked blocks
      if (block.locked) {
        e.preventDefault();
        return;
      }
      
      // Store drag state
      const duration = calculateDuration(block.startAt, block.endAt);
      setDragState({
        blockId: block.id,
        originalStartAt: block.startAt,
        duration,
      });
      
      // Set drag effect
      e.dataTransfer.effectAllowed = "move";
      
      // Store block ID in dataTransfer for drop handling
      e.dataTransfer.setData("blockId", block.id);
      
      // Add some visual feedback
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = "0.5";
      }
    },
    []
  );
  
  /**
   * Handles drag end event
   * Resets visual state
   */
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    // Reset opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    
    // Clear drag state after a brief delay to allow drop handler to complete
    setTimeout(() => {
      setDragState(null);
    }, 100);
  }, []);
  
  /**
   * Handles drag over event on drop zones
   * Must call preventDefault to allow dropping
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);
  
  /**
   * Handles drop event on a day column
   * Calculates new position, validates, and updates state
   */
  const handleDrop = useCallback(
    (date: Date, e: React.DragEvent) => {
      e.preventDefault();
      
      if (!dragState) {
        return;
      }
      
      // Get the block being moved
      const block = state.scheduleBlocks.find((b) => b.id === dragState.blockId);
      if (!block) {
        return;
      }
      
      // Calculate drop position based on mouse Y coordinate
      const dropZone = e.currentTarget as HTMLElement;
      const rect = dropZone.getBoundingClientRect();
      const y = e.clientY - rect.top;
      
      // Account for the header height (64px)
      const headerHeight = 64;
      const yInGrid = y - headerHeight;
      
      // Each hour is 64px (4 intervals * 16px)
      // Calculate which interval was clicked
      const pixelsPerInterval = 16;
      const intervalIndex = Math.floor(yInGrid / pixelsPerInterval);
      
      // Convert interval index to time
      const hours = Math.floor(intervalIndex / 4);
      const minutes = (intervalIndex % 4) * 15;
      
      // Create new start time on the dropped day
      let newStartAt = new Date(date);
      newStartAt.setHours(hours, minutes, 0, 0);
      
      // Snap to 15-minute interval
      newStartAt = snapToInterval(newStartAt);
      
      // Calculate new end time (maintain duration)
      const newEndAt = addMinutes(newStartAt, dragState.duration);
      
      // Validate: Check for overlap with fixed events
      const overlappingEvent = checkOverlapWithFixed(
        newStartAt,
        newEndAt,
        state.fixedEvents
      );
      
      if (overlappingEvent) {
        // Overlap detected - show error and revert
        toast.error("Cannot move block", {
            description: `This time slot overlaps with ${overlappingEvent.title}`,
        });
        // Block will snap back automatically (no state change)
        return;
      }
      
      // Valid drop - update state
      actions.moveBlock(dragState.blockId, newStartAt);
      
      // Show success feedback
      toast.success("Block moved", {
        description: `Moved to ${newStartAt.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        })}`,
      });
    },
    [dragState, state.scheduleBlocks, state.fixedEvents, actions]
  );
  
  return {
    isDragging: dragState !== null,
    draggingBlockId: dragState?.blockId || null,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
}