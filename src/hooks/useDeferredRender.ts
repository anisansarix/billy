import { useState, useEffect } from 'react';

/**
 * Hook to defer heavy rendering until after navigation animations finish.
 * Bypasses deprecated InteractionManager in favor of requestIdleCallback or setTimeout.
 */
export function useDeferredRender(delayMs = 300) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: ReturnType<typeof setTimeout>;

        // Give the UI thread time to finish the navigation transition (typically 250-300ms).
        // Using setTimeout forces the JS thread to yield, avoiding the InteractionManager deprecation warning.
        timeoutId = setTimeout(() => {
            if (isMounted) {
                // If requestIdleCallback is available, use it to ensure the main thread is fully idle
                if (typeof requestIdleCallback === 'function') {
                    requestIdleCallback(() => {
                        if (isMounted) setIsReady(true);
                    });
                } else {
                    setIsReady(true);
                }
            }
        }, delayMs);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [delayMs]);

    return isReady;
}
