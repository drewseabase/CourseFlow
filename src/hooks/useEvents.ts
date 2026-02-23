import { useState, useEffect, useCallback } from 'react';

export interface Event {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    type: 'work' | 'personal' | 'appointment' | 'other';
    color: string;
    duration: number;
    userId: string;
}

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/events');
            if (!res.ok) {
                setError(`Failed to fetch events: ${res.status}`);
                return;
            }
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);
    
    return { events, loading, error, refresh: fetchEvents };
}