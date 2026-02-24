/**
 * Canvas Data Transformers
 * 
 * Pure functions that map database models into the 
 * CourseMetadata and Assignment shapes exisitng UI components consume
 * Components never change - only data source does
 */
import type { Course, Assignment as PrismaAssignment } from "@prisma/client";

export interface CourseMetadata{
    id: string;
    name: string;
    code: string;
    title: string;
    instructor: string;
    gradientClass: string;
    stats: {
        total: number;
        completed: number;
        upcoming: number;
    };
    progress: number;
}

export interface Assignment {
    id: string;
    duration: string;
    title: string;
    time: string;
    dueDate: string;
    gradientClass: string;
    dateKey: string;
    course: string;
    type: string;
}

type CourseWithAssignments = Course & {
    assignments: PrismaAssignment[];
};

/**
 * Transform a DB Course row into CourseMetadata
 * Stats are computed here on server, not on client
 */
export function transformCourse(course: CourseWithAssignments): CourseMetadata{
    const now = new Date();

    const total = course.assignments.length;
    const completed = course.assignments.filter(a => a.isCompleted).length;
    const upcoming = course.assignments.filter(
        a => !a.isCompleted && a.dueAt !== null && a.dueAt > now
    ).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
        id: course.id,
        name: course.name,
        code: course.code,
        title: course.name,
        instructor: course.instructorName ?? 'Instructor',
        gradientClass: course.gradientClass ?? 'from-indigo-500 to-purple-500',
        stats: {total, completed, upcoming},
        progress,
    };
}

/**
 * Map Canvas grading_type / submission_type to human-readable assignment type
 */
function inferAssignmentType(assignment: PrismaAssignment): string{
    const title = assignment.title.toLowerCase()
    const types = assignment.submissionTypes;

    if(types.includes('online_quiz')) return 'Quiz Prep';
    if(types.includes('discussion_topic')) return 'Discussion';
    if(types.includes('media_recording')) return 'Media';

    if (title.includes('problem set') || title.includes('pset')) return 'Problem Set';
    if (title.includes('lab')) return 'Lab Report';
    if (title.includes('essay') || title.includes('paper') || title.includes('writing')) return 'Essay';
    if (title.includes('reading')) return 'Reading';
    if (title.includes('quiz') || title.includes('exam')) return 'Quiz Prep';
    if (title.includes('project') || title.includes('programming') || title.includes('coding')) return 'Programming Assignment';

    return 'Assignment';
}

/**
 * Format a Date into "Due Friday" display string
 */
function formatDueDate(date: Date): string{
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday'];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if(date.toDateString() === today.toDateString()) return 'Due Today';
    if(date.toDateString() === tomorrow.toDateString()) return 'Due Tomorrow';

    return `Due ${days[date.getDay()]}`;
}

/**
 * Format a Date into "11:59 PM"
 */
function formatTime(date: Date): string{
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Format a Date into YYYY-MM-DD dateKey
 */
function formatDateKey(date: Date): string{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');

    return `${year}-${month}-${day}`;
}

type AssignmentWithCourse = PrismaAssignment & {
    course: {code: string; gradientClass: string | null};
};

/**
 * Transform a DB Assignment row into the assignment shape the UI expects
 */

export function transformAssignment(assignment: AssignmentWithCourse): Assignment{
    const type = inferAssignmentType(assignment);
    const dueAt = assignment.dueAt;

    return {
        id: assignment.id,
        title: assignment.title,
        course: assignment.course.code,
        gradientClass: assignment.course.gradientClass ?? 'from-indigo-500 to-purple-500',
        type,
        duration: assignment.pointsPossible ? `${Math.round(assignment.pointsPossible)} pts` : 'Due soon',
        time: dueAt ? formatTime(dueAt) : 'No time set',
        dueDate: dueAt ? formatDueDate(dueAt) : 'No due date',
        dateKey: dueAt ? formatDateKey(dueAt): '',
    };
}