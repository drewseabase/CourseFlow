export default function TodaysFocus() {
  const tasks = [
    {
      id: 1,
      duration: "60 min",
      title: "ECON 101 Problem Set",
      time: "9:00 AM",
      dueDate: "Due Friday",
      gradientClass: "from-[#667eea] to-[#764ba2]"
    },
    {
      id: 2,
      duration: "75 min",
      title: "CS 202 Lab Report",
      time: "2:00 PM",
      dueDate: "Due Monday",
      gradientClass: "from-[#4facfe] to-[#00f2fe]"
    },
    {
      id: 3,
      duration: "40 min",
      title: "Biology Reading Ch. 8",
      time: "7:00 PM",
      dueDate: "Due Tuesday",
      gradientClass: "from-[#43e97b] to-[#38f9d7]"
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Panel Header */}
      <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-[20px] font-bold mb-2">
          Today's Focus
        </div>
        <div className="text-[14px] text-[#52525B]">
          Wednesday, Feb 7
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
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
              <button className={`flex-1 py-2.5 px-4 rounded-[10px] font-semibold text-[13px] text-white bg-linear-to-r ${task.gradientClass} border-0 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer`}>
                Start
              </button>
              <button className="flex-1 py-2.5 px-4 rounded-[10px] font-semibold text-[13px] bg-transparent border-2 border-[#E4E4E7] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}