import { canvasFetchAll, CanvasClientConfig } from "./client";

export interface CanvasAnnouncement{
    id: number;
    title: string;
    message: string;
    posted_at: string;
    context_code: string;
}

/**
 * Fetch recent announcements across all provided course IDs
 * Canva's discussion_topics endpoint with only_announcements = true
 * supports filtering by multiple context_codes in one call
 */
export async function fetchAnnouncements(
    config: CanvasClientConfig,
    courseIds: number[]
): Promise<CanvasAnnouncement[]>{
    if(courseIds.length === 0) return [];

    const contextCodes = courseIds.map(id => `course_${id}`).join(',');

    const raw = await canvasFetchAll(config, '/announcements', {
        context_codes: contextCodes,
        start_date: getThirtyDaysAgo(),
        per_page: '50',
    });

    return raw as CanvasAnnouncement[];
}

function getThirtyDaysAgo(): string{
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
}