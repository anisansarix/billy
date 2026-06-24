import { useState, useEffect } from 'react';

export function useModalReady(visible: boolean, delayMs = 150) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        if (visible) {
            setIsReady(false);
            timeoutId = setTimeout(() => {
                setIsReady(true);
            }, delayMs);
        } else {
            setIsReady(false);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [visible, delayMs]);

    return isReady;
}
