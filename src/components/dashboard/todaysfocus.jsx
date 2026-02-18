'use client';

/**
 * TodaysFocus Component
 * 
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - The date to display tasks for
 * @param {Array} props.tasks - Array of tasks for the selected date
 */

export default function TodaysFocus({ selectedDate, tasks }) {
  // Get today's actual date for comparison
  const today = new Date();
  
  /**
   * Check if the selected date is today
   * @returns {boolean} True if selectedDate is today
   */
  const isToday = () => {
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };
  
  /**
   * Format the selected date as "DayName, Mon DD"
   * Example: "Monday, Feb 09"
   * @returns {string} Formatted date string
   */
  const getFormattedDate = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = dayNames[selectedDate.getDay()];
    const monthName = monthNames[selectedDate.getMonth()];
    const date = selectedDate.getDate();
    
    return `${dayName}, ${monthName} ${date}`;
  };

  const panel =
    'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';

  const ClockIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="7" x2="12" y2="12" strokeLinecap="round" />
      <line x1="12" y1="12" x2="15.5" y2="14.5" strokeLinecap="round" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const CalendarEmptyIcon = () => (
    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const cardHover = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'translate(-2px, -2px)';
      e.currentTarget.style.boxShadow = '4px 4px 0px 0px #18181B';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  const btnHover = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'translate(-1px, -1px)';
      e.currentTarget.style.boxShadow = '2px 2px 0px 0px #18181B';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Panel Header */}
      <div className={`p-6 ${panel}`}>
        <div className="text-[20px] font-bold mb-2">
          Today's Focus
        </div>
        <div className="text-[15px] text-[#52525B]">
          {getFormattedDate()}
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-150 ${panel}`}
              {...cardHover}
            >
              
              {/* Task Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="inline-block px-3 py-1 rounded-lg text-[12px] font-bold uppercase text-black">
                  {task.duration}
                </div>
              </div>

              {/* Task Title */}
              <div className="text-[16px] font-semibold mb-2">
                {task.title}
              </div>

              {/* Task Meta */}
              <div className="flex gap-4 text-[13px] text-[#52525B]">
                <div className="flex items-center gap-1.5">
                  <ClockIcon />
                  <span>{task.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarIcon />
                  <span>{task.dueDate}</span>
                </div>
              </div>

              {/* Task Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 py-2.5 px-4 rounded-[10px] font-semibold text-[13px] border-[1.5px] border-violet-400/40 bg-violet-500/10 text-violet-700 transition-all duration-150"
                  {...btnHover}
                >
                  Start
                </button>
                <button
                  className="flex-1 py-2.5 px-4 rounded-[10px] font-semibold text-[13px] border-[1.5px] border-red-400/30 bg-red-500/[0.07] text-red-800 transition-all duration-150"
                  {...btnHover}
                >
                  Skip
                </button>
              </div>
            </div>
          ))
        ) : (
          /* Empty State - No tasks for this day */
          <div className={`p-8 text-center ${panel}`}>
            <CalendarEmptyIcon />
            <div className="text-[18px] font-semibold text-[#18181B] mb-2">
              No Tasks Scheduled
            </div>
            <div className="text-[14px] text-[#52525B]">
              {isToday() ? "Enjoy your free time today!" : "No tasks scheduled for this day"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
