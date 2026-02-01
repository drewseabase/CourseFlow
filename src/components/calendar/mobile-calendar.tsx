/**
 * MobileCalendar Component
 * 
 * Mobile-optimized calendar view with two display modes:
 * 1. Day Selector: Dropdown/tabs to select a single day, shows blocks in list
 * 2. Accordion: Collapsible panels for all 7 days of the week
 * 
 * Users can toggle between modes with a button.
 */

"use client";

import React, { useState } from "react";
import { MobileDaySelector } from "./mobile-day-selector";
import { MobileAccordion } from "./mobile-accordion";
import { Button } from "@/components/ui/button";
import { List, Rows } from "lucide-react";

/**
 * Display modes for mobile calendar
 */
type MobileViewMode = "selector" | "accordion";

/**
 * MobileCalendar component
 * 
 * Container that manages the mobile calendar display mode.
 * Provides a toggle button to switch between day selector and accordion views.
 * 
 * @returns Rendered mobile calendar
 */
export function MobileCalendar() {
  // State for current display mode
  const [viewMode, setViewMode] = useState<MobileViewMode>("selector");
  
  /**
   * Toggles between selector and accordion modes
   */
  const toggleViewMode = () => {
    setViewMode((current) => (current === "selector" ? "accordion" : "selector"));
  };
  
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Mode toggle button */}
      <div className="flex items-center justify-end px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
          className="flex items-center gap-2"
        >
          {viewMode === "selector" ? (
            <>
              <Rows className="w-4 h-4" />
              <span>Week View</span>
            </>
          ) : (
            <>
              <List className="w-4 h-4" />
              <span>Day View</span>
            </>
          )}
        </Button>
      </div>
      
      {/* Render appropriate view based on mode */}
      <div className="flex-1 overflow-auto">
        {viewMode === "selector" ? (
          <MobileDaySelector />
        ) : (
          <MobileAccordion />
        )}
      </div>
    </div>
  );
}