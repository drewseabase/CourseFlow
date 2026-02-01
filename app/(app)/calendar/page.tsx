/**
 * Calendar Page
 * 
 * Main page for the weekly calendar view
 * Displays the full schedule with fixed events and study blocks
 * 
 * Route: /calendar
 */
import { WeekView } from "@/components/calendar/week-view";

/**
 * CalendarPage component
 * 
 * Simple page wrapper that renders the WeekView component.
 * The WeekView handles all calendar logic and navigation
 * 
 * @returns Rendered calendar page
 */
export default function CalendarPage(){
  return(
    <div className="container mx-auto p-4 h-screen">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray=900"> Calendar</h1>
        <p className="text-gray-600 mt-1">
          View and manage your weekly schedule
        </p>
     </div>

    {/*Calendar View*/}
    <WeekView/>
    </div>
  )
}
