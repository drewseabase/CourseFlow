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
    'bg-white/90 backdrop-blur-md border border-zinc-200/70 rounded-3xl shadow-sm';

  return (
    <div className="flex flex-col gap-4">
      {/* Panel Header */}
      <div className={`p-6 ${panel}`}>
        <div className="text-[20px] font-bold mb-2">
          Today's Focus
        </div>
        <div className="text-[14px] text-[#52525B]">
          {getFormattedDate()}
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3">
        {/* Show tasks if available */}
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${panel}`}
            >
              {/* Left gradient border */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b ${task.gradientClass}`}></div>
              
              {/* Task Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="inline-block px-3 py-1 rounded-lg text-[11px] font-bold uppercase bg-[#FAFAFA] text-[#8B5CF6]">
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
                  <span>⏰</span>
                  <span>{task.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>📅</span>
                  <span>{task.dueDate}</span>
                </div>
              </div>

              {/* Task Actions */}
              <div className="flex gap-2 mt-4">
                <button className={`flex-1 py-2.5 px-4 rounded-[10px] font-semibold text-[13px] text-white bg-linear-to-r ${task.gradientClass} border-0 transition-all duration-200 hover:-translate-y-0.5`}>
                  Start
                </button>
                <button className="flex-1 py-2.5 px-4 rounded-[10px] font-semibold text-[13px] bg-transparent border-2 border-[#E4E4E7] transition-all duration-200 hover:-translate-y-0.5">
                  Skip
                </button>
              </div>
            </div>
          ))
        ) : (
          /* Empty State - No tasks for this day */
          <div className={`p-8 text-center ${panel}`}>
            <div className="text-[48px] mb-4">📅</div>
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
