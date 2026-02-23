import { CanvasClientConfig, canvasFetchAll } from "./client";

export interface CanvasCourse{
    id: number;
    name: string;
    course_code: string;
    enrollment_term_id: number;
    enrollments?: {type: string; enrollment_state: string}[];
    term?:{name: string};
    teachers?: {display_name: string}[];
}

/**
 * Fetch all active courses for the current user
 * Filters to only active enrollment to avoid returning every course ever taken
 */

export async function fetchCourses(config: CanvasClientConfig): Promise<CanvasCourse[]>{
    const raw = await canvasFetchAll(config, '/courses', {
        enrollment_state: 'active',
        include: 'term, enrollments, teachers',
        state: 'available',
    });

    return (raw as CanvasCourse[]).filter(course =>{
        if(!course.id || !course.name) return false;

        const enrollment = course.enrollments?.find(e => e.enrollment_state === 'active');
        if(!enrollment) return false;

        return true;
    });
}