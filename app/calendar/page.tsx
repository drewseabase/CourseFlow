/**
 * 
 * Calendar Page
 * 
 * Main calendar page that orchestrates all calendar components
 * 
 * Manages:
 * - View State
 * - Current Date
 * - Event data generation and filtering
 * - Modal state for month view
 * 
 * Layout:
 * - CalendarControls
 * - CalendarLegend
 * - Active view Component
 * - EventModal
 */
'use client'
import { useState, useEffect } from "react";
import CalendarControls from "@/components/calendar/calendarControls";
import CalendarLegend from "@/components/calendar/calendarLegend";
import WeekView from "@/components/calendar/weekView";
import { generateCalendarEvents, getEventsForDay, getEventsForWeek, getEventsForMonth, getWeekStart, getMonthStart, CalendarEvent } from "@/lib/mock/calendardatagenerator";

export default function CalendarPage() {
  // Get today's date for initial state
  const today = new Date();
  
  /**
   * State: Current view type
   */
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('week');
  
  /**
   * State: Currently viewing date
   */
  const [currentDate, setCurrentDate] = useState<Date>(today);
  
  /**
   * State: All generated events (2-3 months worth)
   */
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  
  /**
   * State: Modal for month view
   */
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState<Date | null>(null);
  
  /**
   * Effect: Generate events on component mount
   * Creates events for 3 months (before, current, after)
   */
  useEffect(() => {
    // Start date: 1 month before current date
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1);
    startDate.setDate(1);
    
    // End date: 2 months after current date
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 2);
    endDate.setDate(0); // Last day of month
    
    // Generate all events
    const events = generateCalendarEvents(startDate, endDate);
    setAllEvents(events);
  }, []); // Only run once on mount
  
  /**
   * Get events for current view
   */
  const getCurrentViewEvents = (): CalendarEvent[] => {
    if (viewType === 'day') {
      return getEventsForDay(currentDate, allEvents);
    } else if (viewType === 'week') {
      const weekStart = getWeekStart(currentDate);
      return getEventsForWeek(weekStart, allEvents);
    } else if (viewType === 'month') {
      const monthStart = getMonthStart(currentDate);
      return getEventsForMonth(monthStart, allEvents);
    }
    return [];
  };
  
  /**
   * Handle view change (Day/Week/Month buttons)
   */
  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setViewType(view);
  };
  
  /**
   * Handle navigation (Previous/Next/Today buttons)
   */
  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }
    
    const newDate = new Date(currentDate);
    
    if (viewType === 'day') {
      // Move by 1 day
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewType === 'week') {
      // Move by 7 days (to next/prev Sunday)
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewType === 'month') {
      // Move by 1 month
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };
  
  /**
   * Handle day click in month view (opens modal)
   */
  const handleDayClick = (date: Date) => {
    setSelectedModalDate(date);
    setModalOpen(true);
  };
  
  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedModalDate(null);
  };
  
  // Get events for current view
  const viewEvents = getCurrentViewEvents();
  
  // Get events for modal (if open)
  const modalEvents = selectedModalDate 
    ? getEventsForDay(selectedModalDate, allEvents)
    : [];
  
  return (
    <main className="max-w-375 mx-auto px-6 py-6">
      {/* Calendar Controls */}
      <CalendarControls
        currentDate={currentDate}
        viewType={viewType}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
      />
      {/*Calendar Container*/}
      <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <CalendarLegend events={viewEvents} viewType = {viewType}/>

        {/*Active View*/}
        {viewType === 'week' && (
            <WeekView weekStart = {getWeekStart(currentDate)} events = {viewEvents}/>
        )}
      </div>
    </main>
);
}