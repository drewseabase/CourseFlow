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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, []); // stable reference — never recreated

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, loading, error, refresh: fetchEvents };
}