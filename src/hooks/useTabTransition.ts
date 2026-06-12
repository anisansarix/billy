import { useState, useCallback } from 'react';

export function useTabTransition(delayMs = 250) {
    const [isTabReady, setIsTabReady] = useState(true);

    const startTransition = useCallback((callback: () => void) => {
        setIsTabReady(false);
        callback();
        
        setTimeout(() => {
            setIsTabReady(true);
        }, delayMs);
    }, [delayMs]);

    return { isTabReady, startTransition };
}
