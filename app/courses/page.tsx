/**
 * Courses Page
 * 
 * Main courses page that displays:
 * - Course grid with all enrolled courses
 * - Upcoming assignments section (filterable by course)
 * - Modals for syllabus viewing and assignment details
 * 
 * Manages state for:
 * - Course filtering
 * - Modal visibility
 * - Assignment data
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import CourseCard from '@/components/courses/courseCard';
import UpcomingAssignments, { Assignment } from '@/components/courses/upcomingAssignments';
import SyllabusModal from '@/components/courses/syllabusModal';
import AssignmentDetailModal from '@/components/courses/assignmentDetailModal';
import { getAllCourses, getSemesterName, CourseMetadata } from '@/lib/mock/coursedata';
import { generateMultiWeekTasks, getDateKey, Task } from '@/lib/mock/mocktaskgenerator';
import { ASSIGNMENT_TEMPLATES } from '@/lib/mock/seed-data';

export default function CoursesPage() {
  // Get current date
  const today = new Date();
  
  /**
   * State: All courses
   */
  const [allCourses, setAllCourses] = useState<CourseMetadata[]>([]);
  
  /**
   * State: All assignments (next 14 days)
   */
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  
  /**
   * State: Filtered course (null = show all)
   */
  const [filteredCourse, setFilteredCourse] = useState<string | null>(null);
  
  /**
   * State: Syllabus modal
   */
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [syllabusModalCourse, setSyllabusModalCourse] = useState<string>('');
  
  /**
   * State: Assignment detail modal
   */
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  /**
   * Ref: Upcoming assignments section for scrolling
   */
  const assignmentsRef = useRef<HTMLDivElement>(null);
  
  /**
   * Effect: Load courses and assignments on mount
   */
  useEffect(() => {
    // Load all courses
    const courses = getAllCourses();
    setAllCourses(courses);
    
    // Generate tasks for next 2 weeks
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Move to Sunday
    
    const tasksMap = generateMultiWeekTasks(weekStart, 2);
    
    // Convert tasks to assignments and filter to next 14 days
    const assignments: Assignment[] = [];
    const fourteenDaysFromNow = new Date(today);
    fourteenDaysFromNow.setDate(today.getDate() + 14);
    
    tasksMap.forEach((tasks: Task[]) => {
      tasks.forEach((task) => {
        // Parse task date
        const [year, month, day] = task.dateKey.split('-').map(Number);
        const taskDate = new Date(year, month - 1, day);
        
        // Only include if within next 14 days
        if (taskDate >= today && taskDate <= fourteenDaysFromNow) {
          // Determine assignment type from task title
          const type = inferAssignmentType(task.title);
          
          assignments.push({
            ...task,
            type,
            typeIcon: getTypeIcon(type),
          });
        }
      });
    });
    
    // Sort by date
    assignments.sort((a, b) => {
      const dateA = new Date(a.dateKey);
      const dateB = new Date(b.dateKey);
      return dateA.getTime() - dateB.getTime();
    });
    
    setAllAssignments(assignments);
  }, []);
  
  /**
   * Infer assignment type from task title
   * Maps to types in ASSIGNMENT_TEMPLATES
   */
  function inferAssignmentType(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('problem set')) return 'Problem Set';
    if (lowerTitle.includes('lab report')) return 'Lab Report';
    if (lowerTitle.includes('programming') || lowerTitle.includes('coding')) return 'Programming Assignment';
    if (lowerTitle.includes('essay')) return 'Essay';
    if (lowerTitle.includes('reading')) return 'Reading';
    if (lowerTitle.includes('quiz prep')) return 'Quiz Prep';
    
    // Default based on course
    if (title.includes('CS') || title.includes('Computer Science')) return 'Programming Assignment';
    if (title.includes('HIST') || title.includes('History')) return 'Essay';
    if (title.includes('BIO') || title.includes('Physics')) return 'Lab Report';
    
    return 'Problem Set';
  }
  
  /**
   * Get icon for assignment type
   */
  function getTypeIcon(type: string): string {
    const iconMap: Record<string, string> = {
      'Problem Set': '📝',
      'Lab Report': '🔬',
      'Programming Assignment': '💻',
      'Essay': '✍️',
      'Reading': '📖',
      'Quiz Prep': '📚',
    };
    return iconMap[type] || '📄';
  }
  
  /**
   * Get filtered assignments based on selected course
   */
  function getFilteredAssignments(): Assignment[] {
    if (!filteredCourse) {
      return allAssignments;
    }
    return allAssignments.filter(assignment => assignment.course === filteredCourse);
  }
  
  /**
   * Handle view syllabus click
   */
  function handleViewSyllabus(courseName: string) {
    setSyllabusModalCourse(courseName);
    setSyllabusModalOpen(true);
  }
  
  /**
   * Handle filter by course click
   * Also scrolls to assignments section
   */
  function handleFilterByCourse(courseName: string) {
    setFilteredCourse(courseName);
    
    // Scroll to assignments section
    setTimeout(() => {
      assignmentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  
  /**
   * Handle clear filter
   */
  function handleClearFilter() {
    setFilteredCourse(null);
  }
  
  /**
   * Handle assignment click
   */
  function handleAssignmentClick(assignment: Assignment) {
    setSelectedAssignment(assignment);
    setAssignmentModalOpen(true);
  }
  
  /**
   * Handle mark complete (no persistence for now)
   */
  function handleMarkComplete(assignmentId: string) {
    console.log('Marked complete:', assignmentId);
    // TODO: Implement persistence later
  }

    return (
        <main className='max-w-300 mx-auto px-6 p-y ml-35'>

            <div className='grid grid-cols-3 gap-4 mb-8'>
                {allCourses.map((course) =>(
                    <CourseCard key={course.id} course={course} onViewSyllabus={handleViewSyllabus} onViewAssignment={handleFilterByCourse}/>
                ))}
            </div>

            <div ref={assignmentsRef}>
                <UpcomingAssignments assignments={getFilteredAssignments()} filteredCourse={filteredCourse} onClearFilter = {handleClearFilter} onAssignmentClick={handleAssignmentClick}/>
            </div>

            <SyllabusModal isOpen={syllabusModalOpen} onClose={() => setSyllabusModalOpen(false)} courseName={syllabusModalCourse}/>

            <AssignmentDetailModal isOpen={assignmentModalOpen} onClose={() => setAssignmentModalOpen(false)} assignment={selectedAssignment} onMarkComplete={handleMarkComplete}/>
        </main>
    );
}