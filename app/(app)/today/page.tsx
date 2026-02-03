/**
 * Today Page
 * 
 * Displays the execution list for the selected day.
 * Shows all study blocks with actions to mark done, skip, lock, and adjust duration
 * 
 * Route: /today
 */

import { TodayView } from "@/components/today/today-view";

/**
 * TodayPage component
 * 
 * Simple page wrapper that renders the TodayView component.
 * The TodayView handles all the logic for displaying and managing tasks
 * 
 * @returns Rendered Today page
 */

export default function TodayPage(){
  return(
    <div className="container mx-auto p-4 max-w-4xl">
      {/*Page Header*/}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900"> Today's Tasks</h1>
        <p className="text-gray-600 mt-1">
          Manage your study blocks and track progress
        </p>
      </div>

      {/*Today view*/}
      <TodayView/>
    </div>
  );
}