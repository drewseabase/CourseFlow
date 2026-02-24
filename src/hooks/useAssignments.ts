import {useState, useEffect, useCallback} from 'react';
import type { Assignment } from '@/lib/canvas/transformer';

export function useAssignments(courseId?: string){
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAssignments = useCallback(async () =>{
        try{
            setLoading(true);
            const url = courseId ? `/api/assignments?courseId=${courseId}` : '/api/assignments';

            const res = await fetch(url);
            if(!res.ok){
                setError('Failed to fetch assignments');
                return;
            }

            const data = await res.json();
            setAssignments(data);
        }catch {
            setError('Failed to load assignments');
        }finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    return {assignments, loading, error, refresh: fetchAssignments};
}