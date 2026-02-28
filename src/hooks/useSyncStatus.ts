import {useState, useEffect, useCallback} from 'react';

type SyncState = 'idle' | 'synced' | 'error' | 'syncing';

export function useSyncStatus() {
    const [syncState, setSyncState] = useState<SyncState>('idle');
    const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
    const [visible, setVisible] = useState(false);

    const checkStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/canvas/status');
            if(!res.ok) return;
            const data = await res.json();

            if(!data.connected){
                setSyncState('idle');
                return;
            }

            setLastSyncedAt(data.lastSyncedAt ? new Date(data.lastSyncedAt) : null);
            setSyncState('synced');
            setVisible(true);

            setTimeout(() => setVisible(false), 5000);
        }catch{
            setSyncState('error');
            setVisible(true);
            setTimeout(()=> setVisible(false), 5000);
        }
    }, []);

    const triggerSync = useCallback(async () => {
        setSyncState('syncing');
        setVisible(true);

        try{
            const res = await fetch('/api/canvas/sync', {method: 'POST'});
            const data = await res.json();

            if(!res.ok){
                setSyncState('error');
            }else{
                setLastSyncedAt(data.lastSyncedAt ? new Date(data.lastSyncedAt) : null);
                setSyncState('synced');
            }
        }catch {
            setSyncState('error');
        }

        setTimeout(() => setVisible(false), 5000);
    }, []);

    useEffect(() => {
        checkStatus();
        window.addEventListener('focus', checkStatus);
        return () => window.removeEventListener('focus', checkStatus);
    }, [checkStatus]);

    return {syncState, lastSyncedAt, visible, triggerSync};
}