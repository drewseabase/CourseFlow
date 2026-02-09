import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import WeekOverview from "@/components/dashboard/weekoverview";
import TasksThisWeek from "@/components/dashboard/tasksthisweek";
import StudyHours from "@/components/dashboard/studyhours";
import TodaysFocus from "@/components/dashboard/todaysfocus";
import Calendar from "@/components/dashboard/calendar";


export const metadata: Metadata = {
  title: "CourseFlow - Student Scheduling",
  description: "Automatically turn class deadlines into a realistic, continuously-updating schedule",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return(
    <html lang="en">
      <body>
        {/*Main Content*/}
        <div className="max-w-375 mx-auto px-10 py-10">
          <Navbar/>
          <main>
            <div className="grid grid-cols-3 gap-6 mb-12">
              <WeekOverview/>
              <TasksThisWeek/>
              <StudyHours/>
            </div>

          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-1 w-105">
              <TodaysFocus/>
            </div>
            <div className="col-span-2">
              <Calendar/>
            </div>
          </div>
          </main>
        </div>
      </body>
    </html>
  );
}