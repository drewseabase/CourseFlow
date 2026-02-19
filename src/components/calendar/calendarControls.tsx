/**
 * CalendarControls Component
 * 
 * Top navigation bar for the calendar that includes:
 * - Date navigation (previous/next arrows)
 * - Current date range display (auto-formatted based on view)
 * - "Today" button to jump to current date
 * - "Add Event" button to open the global add event modal
 * - View switcher (Day/Week/Month buttons)
 */

interface CalendarControlsProps {
  currentDate: Date;
  viewType: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  onAddEvent: () => void;
}

function formatDateRange(date: Date, viewType: 'day' | 'week' | 'month'): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (viewType === 'day') {
    const dayName = dayNames[date.getDay()];
    const monthName = monthNamesShort[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${dayName}, ${monthName} ${day}, ${year}`;
  }

  if (viewType === 'week') {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startMonth = monthNamesShort[weekStart.getMonth()];
    const endMonth = monthNamesShort[weekEnd.getMonth()];
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const year = weekEnd.getFullYear();

    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }

  if (viewType === 'month') {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  }

  return '';
}

export default function CalendarControls({
  currentDate,
  viewType,
  onViewChange,
  onNavigate,
  onAddEvent,
}: CalendarControlsProps) {

  const panel = 'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';

  const navBtnHover = {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(-2px, -2px)';
      e.currentTarget.style.boxShadow = '3px 3px 0px 0px #18181B';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  const smallBtnHover = {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(-1px, -1px)';
      e.currentTarget.style.boxShadow = '2px 2px 0px 0px #7c3aed';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  return (
    <div className={`flex justify-between items-center mb-6 p-1.5 ${panel}`}>
      {/* Left side: Date Navigation */}
      <div className="flex gap-1 items-center ml-1">
        {/* Previous Button */}
        <button
          onClick={() => onNavigate('prev')}
          className="w-10 h-10 rounded-[10px] border-[1.5px] border-violet-400/35 bg-violet-500/10 text-violet-700 cursor-pointer flex items-center justify-center transition-all duration-150"
          aria-label="Previous"
          {...navBtnHover}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Current Date Range Display */}
        <div className="text-[20px] font-bold text-[#18181B] min-w-70 text-center">
          {formatDateRange(currentDate, viewType)}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onNavigate('next')}
          className="w-10 h-10 rounded-[10px] border-[1.5px] border-violet-400/35 bg-violet-500/10 text-violet-700 cursor-pointer flex items-center justify-center transition-all duration-150"
          aria-label="Next"
          {...navBtnHover}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        {/* Today Button */}
        <button
          onClick={() => onNavigate('today')}
          className="ml-2 px-3.5 py-2 rounded-lg border-[1.5px] border-violet-400/35 bg-violet-500/10 text-violet-700 font-semibold text-[13px] cursor-pointer transition-all duration-150"
          {...smallBtnHover}
        >
          Today
        </button>

        {/* Add Event Button */}
        <button
          onClick={onAddEvent}
          className="ml-1 px-3.5 py-2 rounded-lg border-[1.5px] border-violet-400/35 bg-violet-500/10 text-violet-700 font-semibold text-[13px] cursor-pointer transition-all duration-150 flex items-center gap-1.5"
          {...smallBtnHover}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Event
        </button>
      </div>

      {/* Right side: View Switcher */}
      <div className="flex gap-1 bg-white/75 border border-zinc-900/8 p-1 rounded-xl">
        <button
          onClick={() => onViewChange('day')}
          className={`
            px-3.5 py-1.5 border-[1.5px] font-semibold text-[13px] cursor-pointer rounded-lg transition-all duration-150
            ${viewType === 'day'
              ? 'bg-violet-500/15 border-violet-400/35 text-violet-700'
              : 'bg-transparent border-transparent text-[#71717A] hover:bg-zinc-900/5 hover:text-zinc-900'
            }
          `}
        >
          Day
        </button>

        <button
          onClick={() => onViewChange('week')}
          className={`
            px-3.5 py-1.5 border-[1.5px] font-semibold text-[13px] cursor-pointer rounded-lg transition-all duration-150
            ${viewType === 'week'
              ? 'bg-violet-500/15 border-violet-400/35 text-violet-700'
              : 'bg-transparent border-transparent text-[#71717A] hover:bg-zinc-900/5 hover:text-zinc-900'
            }
          `}
        >
          Week
        </button>

        <button
          onClick={() => onViewChange('month')}
          className={`
            px-3.5 py-1.5 border-[1.5px] font-semibold text-[13px] cursor-pointer rounded-lg transition-all duration-150
            ${viewType === 'month'
              ? 'bg-violet-500/15 border-violet-400/35 text-violet-700'
              : 'bg-transparent border-transparent text-[#71717A] hover:bg-zinc-900/5 hover:text-zinc-900'
            }
          `}
        >
          Month
        </button>
      </div>
    </div>
  );
}
