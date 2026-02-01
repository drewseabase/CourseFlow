/**
 * useMobileDetect Hook
 * 
 * Custom hook to detect mobile viewport size.
 * Returns true if viewport width is below 768px (typical mobile breakpoint).
 * 
 * This hook listens to window resize events to update responsively.
 */

"use client";

import { useState, useEffect } from "react";

/**
 * Mobile breakpoint in pixels
 * Matches Tailwind's 'md' breakpoint
 */
const MOBILE_BREAKPOINT = 768;

/**
 * useMobileDetect hook
 * 
 * Detects if the current viewport is mobile-sized.
 * Updates on window resize events.
 * 
 * @returns Boolean indicating if viewport is mobile
 */
export function useMobileDetect(): boolean {
  // Initialize with a safe default (false for SSR)
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check initial size on mount
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Set initial value
    checkIsMobile();
    
    // Listen for resize events
    window.addEventListener("resize", checkIsMobile);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  
  return isMobile;
}