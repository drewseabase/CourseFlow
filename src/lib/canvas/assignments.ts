import { canvasFetchAll, CanvasClientConfig } from "./client";

export interface CanvasAssignment {
    id: number;
    name: string;
    description: string | null;
    due_at: string | null;
    points_possible: number | null;
    submission_types: string[];
    grading_type: string;
    published: boolean;
    workflow_state: string;
}

/**
 * Fetch assignments for a specific course
 * Filters out unpublished and ungraded assignments
 */
export async function fetchAssignments(
    config: CanvasClientConfig,
    courseId: number
): Promise<CanvasAssignment[]>{
    const raw = await canvasFetchAll(config, `/courses/${courseId}/assignments`, {
        include: 'submission',
        order_by: 'due_at',
    });

    return (raw as CanvasAssignment[]).filter(assignment =>{
        if(!assignment.published) return false;

        if(assignment.grading_type === 'not_graded') return false;
        
        if(assignment.workflow_state !== 'published') return false;

        return true;
    });
}