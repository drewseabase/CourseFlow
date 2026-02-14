/**
 * Course Data
 * 
 * Mock Course data and statistics for the Courses page
 * Maps courses from seed-data to display information including:
 * - Course Codes and titles
 * - Instructor Names
 * - Gradient classes for styling
 * - Assignment Statistics
 * - Progress percentages
 */
import { COURSES } from "./seed-data";

/**
 * Course Metadata interface
 */
export interface CourseMetadata {
    id: string;
    name: string;
    code: string;
    title: string;
    instructor: string;
    gradientClass: string;
    stats:{
        total: number;
        completed: number;
        upcoming: number;
    }
    progress: number;
}

/**
 * Gradient classes matching the calendar view
 * Assigned in order to each course
 */
const COURSE_GRADIENTS = [
    'from-[#667eea] to-[#764ba2]',
    'from-[#4facfe] to-[#00f2fe]',  
    'from-[#43e97b] to-[#38f9d7]',  
    'from-[#fa709a] to-[#fee140]', 
    'from-[#f093fb] to-[#f5576c]',
];

/**
 * Mock course metadata
 * Static data for course information and statistics
 */

const COURSE_METADATA: Record<string, CourseMetadata> = {
    'Physics 201': {
    id: 'Physics 201',
    name: 'Physics 201',
    code: 'PHYS 201',
    title: 'Introduction to Physics',
    instructor: 'Prof. Sarah Johnson',
    gradientClass: COURSE_GRADIENTS[0],
    stats: {
      total: 12,
      completed: 8,
      upcoming: 4,
    },
    progress: 67,
  },
  'Calculus III': {
    id: 'Calculus III',
    name: 'Calculus III',
    code: 'MATH 301',
    title: 'Multivariable Calculus',
    instructor: 'Prof. Michael Chen',
    gradientClass: COURSE_GRADIENTS[1],
    stats: {
      total: 15,
      completed: 11,
      upcoming: 4,
    },
    progress: 73,
  },
  'Engineering Dynamics': {
    id: 'Engineering Dynamics',
    name: 'Engineering Dynamics',
    code: 'ENGR 250',
    title: 'Engineering Dynamics',
    instructor: 'Dr. Emily Rodriguez',
    gradientClass: COURSE_GRADIENTS[2],
    stats: {
      total: 10,
      completed: 7,
      upcoming: 3,
    },
    progress: 70,
  },
  'Computer Science 101': {
    id: 'Computer Science 101',
    name: 'Computer Science 101',
    code: 'CS 101',
    title: 'Introduction to Computer Science',
    instructor: 'Prof. David Thompson',
    gradientClass: COURSE_GRADIENTS[3],
    stats: {
      total: 14,
      completed: 9,
      upcoming: 5,
    },
    progress: 64,
  },
  'History of Technology': {
    id: 'History of Technology',
    name: 'History of Technology',
    code: 'HIST 320',
    title: 'History of Technology',
    instructor: 'Prof. Rachel Martinez',
    gradientClass: COURSE_GRADIENTS[4],
    stats: {
      total: 8,
      completed: 5,
      upcoming: 3,
    },
    progress: 63,
  },
};

/**
 * Get Metadata for specific course
 * @param {string} coursename - Coursename from seed-data
 * @returns {CourseMetaData | undefined} Course metadata or undefined if not found
 */
export function getCourseMetadata(courseName: string): CourseMetadata | undefined{
    return COURSE_METADATA[courseName];
}
/**
 * Get all courses
 * Returns array of all course metadata in order
 * 
 * @returns {CourseMetadata[]} Array of all courses
 */
export function getAllCourses(): CourseMetadata[]{
    return COURSES.map(courseName => COURSE_METADATA[courseName]).filter(Boolean);
}

/**
 * Get the current semester name based on date
 * 
 * Semester breakdown:
 * - Spring: January - May (months 0-4)
 * - Summer: June - August (months 5-7)
 * - Fall: September - December (months 8-11)
 * 
 * @param {Date} date - Date to determine semester
 * @returns {string} Semester name
 */
export function getSemesterName(date: Date): string{
    const month = date.getMonth();
    const year = date.getFullYear();

    let semester: string;

    if(month >= 0 && month <= 4){
        semester = 'Spring';
    }else if (month >=5 && month <=7){
        semester = 'Summer';
    }else{
        semester = 'Fall';
    }

    return `${semester} ${year} Semester`;
}

/**
 * Get gradient class for a course
 * 
 * @param {string} courseName - Course Name
 * @returns {string} Tailwind gradient class
 */
export function getCourseGradient(courseName: string): string{
    const course = COURSE_METADATA[courseName];
    return course?.gradientClass || COURSE_GRADIENTS[0];
}