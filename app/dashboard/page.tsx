'use client';

import { useState, useEffect } from 'react';
import Calendar from '@/components/dashboard/calendar';
import TodaysFocus from '@/components/dashboard/todaysfocus';
import WeekOverview from '@/components/dashboard/weekoverview';
import TasksThisWeek from '@/components/dashboard/tasksthisweek';
import StudyHours from '@/components/dashboard/studyhours';
import { generateMultiWeekTasks, getTasksForDate, Task } from '@/lib/mock/mocktaskgenerator';

/**
 * Dashboard Component
 * 
 * Parent component that manages the state for the entire dashboard.
 * Handles date selection and coordinates data flow between Calendar and TodaysFocus.
 */
export default function Dashboard() {
  // Get today's date for initial state
  const today = new Date();
  
  /**
   * State: Currently selected date
   * Defaults to today's date on initial load
   */
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  
  /**
   * State: Tasks for the selected date
   * Populated from the generated tasks map
   */
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  
  /**
   * State: Map of all tasks across multiple weeks
   * Generated once on component mount
   */
  const [allTasksMap, setAllTasksMap] = useState<Map<string, Task[]>>(new Map());

  /**
   * Effect: Generate tasks on component mount
   * Creates tasks for 8 weeks (2 months) to ensure we have data
   * for any date the user might click in the calendar
   */
  useEffect(() => {
    // Start from the beginning of the current week (Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    // Generate tasks for 8 weeks
    const tasksMap = generateMultiWeekTasks(weekStart, 8);
    setAllTasksMap(tasksMap);
    
    // Set initial tasks for today
    const todaysTasks = getTasksForDate(today, tasksMap);
    setSelectedTasks(todaysTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array = run once on mount

  /**
   * Handler: Date selection from Calendar component
   * Updates the selected date and fetches tasks for that date
   * 
   * @param {Date} date - The date that was clicked in the calendar
   */
  const handleDateSelect = (date: Date) => {
    // Update selected date state
    setSelectedDate(date);
    
    // Fetch tasks for the selected date
    const tasksForDate = getTasksForDate(date, allTasksMap);
    setSelectedTasks(tasksForDate);
  };

  return (
    <>
      {/*Main Content*/}
      <div className="max-w-375 mx-auto px-10 ml-15">
        <main>
          {/* Top Row: Stats Dashboard - 3 cards */}
          <div className="grid grid-cols-3 gap-4.5 mb-8 ml-12">
            <WeekOverview />
            <TasksThisWeek />
            <StudyHours />
          </div>

          {/* Bottom Row: Today's Focus (left) and Calendar (right) */}
          <div className="grid grid-cols-3 gap-1">
            {/* Today's Focus - Takes 1 column, grows vertically with tasks */}
            <div className="col-span-1 w-80 ml-12">
              <TodaysFocus 
                selectedDate={selectedDate}
                tasks={selectedTasks}
              />
            </div>

            {/* Calendar - Takes 2 columns */}
            <div className="col-span-2">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                tasksMap={allTasksMap}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
