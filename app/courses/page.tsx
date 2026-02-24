'use client';

import { useState, useRef } from 'react';
import CourseCard from '@/components/courses/courseCard';
import UpcomingAssignments from '@/components/courses/upcomingAssignments';
import type { Assignment } from '@/lib/canvas/transformer';
import SyllabusModal from '@/components/courses/syllabusModal';
import AssignmentDetailModal from '@/components/courses/assignmentDetailModal';
import { getSemesterName } from '@/lib/mock/coursedata';
import { useCourses } from '@/hooks/useCourses';
import { useAssignments } from '@/hooks/useAssignments';

export default function CoursesPage() {
  const today = new Date();

  const { courses, loading: coursesLoading, isConnected } = useCourses();
  const { assignments: allAssignments } = useAssignments();

  const [filteredCourse, setFilteredCourse] = useState<string | null>(null);
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [syllabusModalCourse, setSyllabusModalCourse] = useState<string>('');
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const assignmentsRef = useRef<HTMLDivElement>(null);

  function getFilteredAssignments(): Assignment[] {
    if (!filteredCourse) return allAssignments;
    return allAssignments.filter(a => a.course === filteredCourse);
  }

  function handleViewSyllabus(courseName: string) {
    setSyllabusModalCourse(courseName);
    setSyllabusModalOpen(true);
  }

  function handleFilterByCourse(courseName: string) {
    setFilteredCourse(courseName);
    setTimeout(() => {
      assignmentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function handleAssignmentClick(assignment: Assignment) {
    setSelectedAssignment(assignment);
    setAssignmentModalOpen(true);
  }

  function handleMarkComplete(assignmentId: string) {
    console.log('Marked complete:', assignmentId);
  }

  if (coursesLoading) {
    return (
      <main className='max-w-375 mx-auto px-6 ml-20'>
        <div className="mb-8">
          <h1 className="text-[36px] font-bold text-[#18181B] mb-2">Courses</h1>
          <p className="text-[16px] text-[#52525B]">{getSemesterName(today)}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (isConnected === false) {
    return (
      <main className='max-w-375 mx-auto px-6 ml-20'>
        <div className="mb-8">
          <h1 className="text-[36px] font-bold text-[#18181B] mb-2">Courses</h1>
          <p className="text-[16px] text-[#52525B]">{getSemesterName(today)}</p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg className="w-16 h-16 mb-6 text-zinc-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" strokeLinejoin="round" />
          </svg>
          <h2 className="text-[24px] font-bold text-[#18181B] mb-3">Connect Canvas to see your courses</h2>
          <p className="text-[16px] text-[#52525B] mb-8 max-w-md">
            Link your Canvas account to automatically sync your courses, assignments, and deadlines.
          </p>
          
            href="/settings"
            className="px-6 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#764ba2] transition-colors"
          <a>
            Connect Canvas
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className='max-w-375 mx-auto px-6 ml-20'>
      <div className="mb-8">
        <h1 className="text-[36px] font-bold text-[#18181B] mb-2">Courses</h1>
        <p className="text-[16px] text-[#52525B]">{getSemesterName(today)}</p>
      </div>

      <div className='grid grid-cols-3 gap-6 mb-8'>
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onViewSyllabus={handleViewSyllabus}
            onViewAssignment={handleFilterByCourse}
          />
        ))}
      </div>

      <div ref={assignmentsRef}>
        <UpcomingAssignments
          assignments={getFilteredAssignments()}
          filteredCourse={filteredCourse}
          onClearFilter={() => setFilteredCourse(null)}
          onAssignmentClick={handleAssignmentClick}
        />
      </div>

      <SyllabusModal
        isOpen={syllabusModalOpen}
        onClose={() => setSyllabusModalOpen(false)}
        courseName={syllabusModalCourse}
      />

      <AssignmentDetailModal
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        assignment={selectedAssignment}
        onMarkComplete={handleMarkComplete}
      />
    </main>
  );
}