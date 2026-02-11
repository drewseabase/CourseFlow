/**
 * CalendarControls Component
 * 
 * Top navigation bar for the calendar that includes:
 * - Date navigation (previous/next arrows)
 * - Current date range display (auto-formatted based on view)
 * - "Today" button to jump to current date
 * - View switcher (Day/Week/Month buttons)
 * 
 * Matches the original CourseFlow design with white card, rounded corners, and shadows.
 */

interface CalendarControlsProps {
  currentDate: Date;                                    // Currently viewing date
  viewType: 'day' | 'week' | 'month';                  // Current view mode
  onViewChange: (view: 'day' | 'week' | 'month') => void;  // View switch handler
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;  // Navigation handler
}

/**
 * Format date range for display based on view type
 */
function formatDateRange(date: Date, viewType: 'day' | 'week' | 'month'): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  if (viewType === 'day') {
    // Format: "Tuesday, Feb 7, 2026"
    const dayName = dayNames[date.getDay()];
    const monthName = monthNamesShort[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${dayName}, ${monthName} ${day}, ${year}`;
  }
  
  if (viewType === 'week') {
    // Format: "Feb 5 - Feb 11, 2026" or "Feb 28 - Mar 6, 2026" if spans months
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Move to Sunday
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Move to Saturday
    
    const startMonth = monthNamesShort[weekStart.getMonth()];
    const endMonth = monthNamesShort[weekEnd.getMonth()];
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const year = weekEnd.getFullYear();
    
    // If same month
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
      // Different months
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  }
  
  if (viewType === 'month') {
    // Format: "February 2026"
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${monthName} ${year}`;
  }
  
  return '';
}

export default function CalendarControls({
  currentDate,
  viewType,
  onViewChange,
  onNavigate
}: CalendarControlsProps) {

  // Option A surface token
  const panel =
    'bg-white/90 backdrop-blur-md border border-zinc-200/70 rounded-3xl shadow-sm';

  return (
    <div className={`flex justify-between items-center mb-6 p-1.5 ${panel}`}>
      {/* Left side: Date Navigation */}
      <div className="flex gap-0 items-center">
        {/* Previous Button */}
        <button
          onClick={() => onNavigate('prev')}
          className="w-10 h-10 ml-4 border-0 rounded-[10px] bg-[#FAFAFA] cursor-pointer text-lg transition-all duration-200 hover:scale-110 hover:bg-[#E4E4E7]"
          aria-label="Previous"
        >
          ◀
        </button>
        
        {/* Current Date Range Display */}
        <div className="text-[20px] font-bold text-[#18181B] min-w-70 text-center">
          {formatDateRange(currentDate, viewType)}
        </div>
        
        {/* Next Button */}
        <button
          onClick={() => onNavigate('next')}
          className="w-10 h-10 border-0 mr-8 rounded-[10px] bg-[#FAFAFA] cursor-pointer text-lg transition-all duration-200 hover:scale-110 hover:bg-[#E4E4E7]"
          aria-label="Next"
        >
          ▶
        </button>
        
        {/* Today Button */}
        <button
          onClick={() => onNavigate('today')}
          className="px-5 py-2.5 border-2 border-[#8B5CF6] rounded-[10px] bg-transparent text-[#8B5CF6] font-semibold text-sm cursor-pointer transition-all duration-200 hover:bg-[#8B5CF6] hover:text-white"
        >
          Today
        </button>
      </div>
      
      {/* Right side: View Switcher */}
      <div className="flex gap-2 bg-[#FAFAFA] p-1.5 rounded-xl">
        {/* Day View Button */}
        <button
          onClick={() => onViewChange('day')}
          className={`
            px-4 py-2 border-0 font-semibold text-[13px] cursor-pointer rounded-lg transition-all duration-200
            ${viewType === 'day' 
              ? 'bg-[#667eea] shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-white' 
              : 'bg-transparent text-[#52525B] hover:bg-linear-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:shadow-[0_4px_12px_rgba(102,126,234,0.35)]'
            }
          `}
        >
          Day
        </button>
        
        {/* Week View Button */}
        <button
          onClick={() => onViewChange('week')}
          className={`
            px-4 py-2 border-0 font-semibold text-[13px] cursor-pointer rounded-lg transition-all duration-200
            ${viewType === 'week' 
              ? 'bg-[#667eea] shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-white' 
              : 'bg-transparent text-[#52525B] hover:bg-linear-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:shadow-[0_4px_12px_rgba(102,126,234,0.35)]'
            }
          `}
        >
          Week
        </button>
        
        {/* Month View Button */}
        <button
          onClick={() => onViewChange('month')}
          className={`
            px-4 py-2 border-0 font-semibold text-[13px] cursor-pointer rounded-lg transition-all duration-200
            ${viewType === 'month' 
              ? 'bg-[#667eea] shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-white' 
              : 'bg-transparent text-[#52525B] hover:bg-linear-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:shadow-[0_4px_12px_rgba(102,126,234,0.35)]'
            }
          `}
        >
          Month
        </button>
      </div>
    </div>
  );
}
