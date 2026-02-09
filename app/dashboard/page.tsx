import WeekOverview from "@/components/dashboard/weekoverview";
import TasksThisWeek from "@/components/dashboard/tasksthisweek";
import StudyHours from "@/components/dashboard/studyhours";
import TodaysFocus from "@/components/dashboard/todaysfocus";
import Calendar from "@/components/dashboard/calendar";

export default function DashboardPage() {
  return (
    <>
      {/*Main Content*/}
      <div className="max-w-375 mx-auto px-10 py-10">
        <main>
          <div className="grid grid-cols-3 gap-12 mb-12">
            <WeekOverview />
            <TasksThisWeek />
            <StudyHours />
          </div>

          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-1 w-97">
              <TodaysFocus />
            </div>
            <div className="col-span-2">
              <Calendar />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
