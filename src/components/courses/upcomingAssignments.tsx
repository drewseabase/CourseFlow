/**
 * UpcomingAssignments Component
 * 
 * Displays list of upcoming assignments across courses.
 * Features:
 * - Shows all assignments or filtered by course
 * - Filter indicator with clear button
 * - Assignment cards with course info, title, meta, and due date
 * - Click to open assignment details
 * 
 * Assignment data pulled from mockTaskGenerator and filtered to next 14 days.
 */

import { Task } from '@/lib/mock/mocktaskgenerator';
import AssignmentTypeIcon from '../icons/assignmentTypeIcons';

// Assignment interface - extends Task but overrides id to be string
export interface Assignment extends Omit<Task, 'id'> {
  id: string;  // Changed from number to string for unique keys
  type: string;  // Assignment type (Problem Set, Lab Report, etc.)
  description: string;
  submissionTypes: string[];
  attachments: {name: string; url: string | null }[];
  pointsPossible: string;
}

interface UpcomingAssignmentsProps {
  assignments: Assignment[];
  filteredCourse: string | null;
  onClearFilter: () => void;
  onAssignmentClick: (assignment: Assignment) => void;
}

/**
 * Format due date for display
 * Extracts just the day name (e.g., "Due Friday" -> "Friday")
 */
function formatDueDate(dueDate: string): string {
  // dueDate format is "Due Friday", "Due Monday", etc.
  return dueDate.replace('Due ', '');
}

export default function UpcomingAssignments({
  assignments,
  filteredCourse,
  onClearFilter,
  onAssignmentClick,
}: UpcomingAssignmentsProps) {
  // Consistent panel styling
  const panel = 'bg-white/90 backdrop-blur-md border border-zinc-200/70 rounded-3xl shadow-sm';

  const EmptyBookIcon = () => (
    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" strokeLinejoin="round" />
    </svg>
  );
  
  return (
    <div className={`${panel} p-7`}>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-[24px] font-bold text-[#18181B] mb-2">
            Upcoming Assignments
          </div>
          
          {/* Filter Indicator */}
          {filteredCourse && (
            <div className="flex items-center gap-2 mt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6] bg-opacity-10 rounded-lg">
                <span className="text-[13px] font-semibold text-white tracking-wide">
                  Filtered by: {filteredCourse}
                </span>
                <button
                  onClick={onClearFilter}
                  className="text-[#8B5CF6] hover:text-[#764ba2] transition-colors duration-200"
                  aria-label="Clear filter"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Assignment List */}
      <div className="flex flex-col gap-3">
        {assignments.length > 0 ? (
          assignments.map((assignment) => {
            return (
              <div
                key={assignment.id}
                onClick={() => onAssignmentClick(assignment)}
                className="flex gap-4 p-4 rounded-xl bg-[#FAFAFA] cursor-pointer transition-all duration-200 hover:bg-[#E4E4E7] hover:translate-x-1"
              >
                {/* Color Bar */}
                <div className={`w-1 rounded-full bg-linear-to-b ${assignment.gradientClass}`}></div>
                
                {/* Assignment Content */}
                <div className="flex-1">
                  {/* Course Code */}
                  <div className="text-[11px] font-bold uppercase tracking-wide text-[#A1A1AA] mb-1">
                    {assignment.course}
                  </div>
                  
                  {/* Assignment Title */}
                  <div className="text-[15px] font-semibold text-[#18181B] mb-2">
                    {assignment.title}
                  </div>
                  
                  {/* Meta Information */}
                  <div className="flex gap-4 text-[13px] text-[#52525B]">
                    <span>{assignment.duration} estimated</span>
                    <span className="flex items-center gap-1.5">
                      <AssignmentTypeIcon type={assignment.type} />
                      {assignment.type}
                    </span>
                  </div>
                </div>
                
                {/* Due Date */}
                <div className="flex flex-col items-end justify-center text-right">
                  <div className="text-[11px] uppercase tracking-wide text-[#A1A1AA] mb-1">
                    Due
                  </div>
                  <div className="text-[14px] font-bold text-[#18181B]">
                    {formatDueDate(assignment.dueDate)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <EmptyBookIcon />
            <div className="text-[18px] font-semibold text-[#18181B] mb-2">
              No Upcoming Assignments
            </div>
            <div className="text-[14px] text-[#52525B]">
              {filteredCourse 
                ? `No assignments found for ${filteredCourse}`
                : 'You\'re all caught up!'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
