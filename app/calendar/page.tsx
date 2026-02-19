/**
 * 
 * Calendar Page
 * 
 * Main calendar page that orchestrates all calendar components
 * 
 * Manages:
 * - View State
 * - Current Date
 * - Real events from Supabase via useEvents hook
 * - Modal state for month view day click
 * - Legend open/closed state
 * 
 * Layout:
 * - CalendarControls
 * - CalendarLegend (collapsible sidebar) + Active view side by side
 * - EventModal
 */
'use client'
import { useState, useEffect } from "react";
import CalendarControls from "@/components/calendar/calendarControls";
import CalendarLegend from "@/components/calendar/calendarLegend";
import WeekView from "@/components/calendar/weekView";
import DayView from "@/components/calendar/dayView";
import MonthView from "@/components/calendar/monthView";
import EventModal from "@/components/calendar/eventModal";
import { useAddEvent } from "context/addEventContext";
import { useEvents } from "@/hooks/useEvents";
import { CalendarEvent, getWeekStart, getMonthStart } from "@/lib/mock/calendardatagenerator";

export default function CalendarPage() {
  const today = new Date();

  const { openAddEvent, setOnEventAdded } = useAddEvent();
  const { events: rawEvents, loading, refresh } = useEvents();

  // Register refresh once on mount — empty dep array prevents the infinite loop
  useEffect(() => {
    setOnEventAdded(refresh);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Convert raw API events (string dates) to CalendarEvent shape (Date objects)
   */
  const allEvents: CalendarEvent[] = rawEvents.map(e => ({
    id: e.id,
    title: e.title,
    startTime: new Date(e.startTime),
    endTime: new Date(e.endTime),
    type: e.type as CalendarEvent['type'],
    color: e.color,
    duration: e.duration,
    course: undefined,
    gradientClass: undefined,
  }));

  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState<Date | null>(null);

  const [legendOpen, setLegendOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('legendOpen') === 'true';
  });

  const toggleLegend = () => {
    setLegendOpen(prev => {
      localStorage.setItem('legendOpen', String(!prev));
      return !prev;
    });
  };

  const getCurrentViewEvents = (): CalendarEvent[] => {
    if (viewType === 'day') return getEventsForDay(currentDate, allEvents);
    if (viewType === 'week') return getEventsForWeek(getWeekStart(currentDate), allEvents);
    if (viewType === 'month') return getEventsForMonth(getMonthStart(currentDate), allEvents);
    return [];
  };

  const handleViewChange = (view: 'day' | 'week' | 'month') => setViewType(view);

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') { setCurrentDate(new Date()); return; }
    const newDate = new Date(currentDate);
    if (viewType === 'day') newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    else if (viewType === 'week') newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    else if (viewType === 'month') newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleDayClick = (date: Date) => {
    setSelectedModalDate(date);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedModalDate(null);
  };

  const viewEvents = getCurrentViewEvents();
  const modalEvents = selectedModalDate ? getEventsForDay(selectedModalDate, allEvents) : [];

  return (
    <main className="max-w-575 mx-auto px-1 ml-25">
      <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <CalendarControls
          currentDate={currentDate}
          viewType={viewType}
          onViewChange={handleViewChange}
          onNavigate={handleNavigate}
          onAddEvent={openAddEvent}
        />

        {loading && (
          <div className="flex items-center justify-center py-20 text-zinc-400 text-sm font-medium">
            Loading events...
          </div>
        )}

        {!loading && (
          <div className="flex gap-3">
            <CalendarLegend
              events={viewEvents}
              viewType={viewType}
              isOpen={legendOpen}
              onToggle={toggleLegend}
            />

            <div className="flex-1 min-w-0">
              {viewType === 'week' && (
                <WeekView weekStart={getWeekStart(currentDate)} events={viewEvents} />
              )}
              {viewType === 'day' && (
                <DayView date={currentDate} events={viewEvents} />
              )}
              {viewType === 'month' && (
                <MonthView
                  monthStart={getMonthStart(currentDate)}
                  events={viewEvents}
                  selectedDate={selectedModalDate}
                  onDayClick={handleDayClick}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <EventModal
        date={selectedModalDate}
        events={modalEvents}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}

// ─── Filter helpers ───

function getEventsForDay(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);
  return events.filter(e => e.startTime >= dayStart && e.startTime <= dayEnd);
}

function getEventsForWeek(weekStart: Date, events: CalendarEvent[]): CalendarEvent[] {
  const sunday = new Date(weekStart); sunday.setHours(0, 0, 0, 0);
  const saturday = new Date(sunday); saturday.setDate(sunday.getDate() + 6); saturday.setHours(23, 59, 59, 999);
  return events.filter(e => e.startTime >= sunday && e.startTime <= saturday);
}

function getEventsForMonth(monthStart: Date, events: CalendarEvent[]): CalendarEvent[] {
  const firstDay = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1); firstDay.setHours(0, 0, 0, 0);
  const lastDay = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0); lastDay.setHours(23, 59, 59, 999);
  return events.filter(e => e.startTime >= firstDay && e.startTime <= lastDay);
}