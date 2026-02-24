import { useState, useEffect, useCallback } from "react";
import type { CourseMetadata } from "@/lib/mock/coursedata";

export function useCourses(){
    const [courses, setCourses] = useState<CourseMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);

            const statusRes = await fetch('/api/canvas/status');
            if(!statusRes.ok){
                setError('Failed to check Canvas Status');
                return;
            }
            const status = await statusRes.json();
            setIsConnected(status.connected);

            if(!status.connected){
                setCourses([]);
                return;
            }

            const coursesRes = await fetch('/api/courses');
            if(!coursesRes.ok){
                setError('Failed to fetch courses');
                return;
            }

            const data = await coursesRes.json();
            setCourses(data);
        } catch{
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return {courses, loading, error, isConnected, refresh: fetchCourses};
}