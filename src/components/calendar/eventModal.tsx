/**
 * EventModal Component
 * 
 * Modal dialog that appears when clicking a day in month view.
 * Displays:
 * - Selected date
 * - List of all events for that day (chronological order)
 * - Event details (time, title, course, type)
 * - Close button and backdrop click to close
 * - Locks background scroll when open
 */

import { useEffect } from 'react';
import { CalendarEvent } from '@/lib/mock/calendardatagenerator';
import CalendarEventCard from './calendarEvent';

interface EventModalProps {
  date: Date | null;           // Selected day (null if modal closed)
  events: CalendarEvent[];     // Events for that day
  isOpen: boolean;             // Modal visibility
  onClose: () => void;         // Close handler
}

/**
 * Format date for modal header
 */
function formatDate(date: Date): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = dayNames[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${dayName}, ${monthName} ${day}, ${year}`;
}

/**
 * Format time for event list
 */
function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
}

export default function EventModal({ date, events, isOpen, onClose }: EventModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Get the current scroll position
      const scrollY = window.scrollY;
      
      // Store original styles
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Get scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Lock scroll without using position: fixed (which breaks gradients)
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Cleanup: restore scroll when modal closes
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Don't render if not open or no date
  if (!isOpen || !date) return null;
  
  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );
  
  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.15)] max-w-2xl w-full max-h-[80vh] overflow-hidden pointer-events-auto transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E4E4E7] flex justify-between items-start">
            <div>
              <h2 className="text-[24px] font-bold text-[#18181B]">
                {formatDate(date)}
              </h2>
              <p className="text-[14px] text-[#52525B] mt-1">
                {sortedEvents.length} {sortedEvents.length === 1 ? 'event' : 'events'}
              </p>
            </div>
            
            {/* Close Button - Prominent X in top right */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-[10px] bg-[#FAFAFA] hover:bg-[#E4E4E7] transition-all duration-200 flex items-center justify-center text-[#52525B] hover:text-[#18181B] text-xl font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          
          {/* Event List */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {sortedEvents.length > 0 ? (
              <div className="space-y-3">
                {sortedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="relative"
                  >
                    <CalendarEventCard event={event} viewType="day" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-[48px] mb-4">📅</div>
                <div className="text-[18px] font-semibold text-[#18181B] mb-2">
                  No Events
                </div>
                <div className="text-[14px] text-[#52525B]">
                  No events scheduled for this day
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
