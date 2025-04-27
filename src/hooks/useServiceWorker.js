import { useEffect } from 'react';

const useServiceWorker = () => {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const registerServiceWorker = async () => {
                try {
                    // Use different service worker paths for dev vs prod
                    const swUrl = import.meta.env.VITE_DEV
                        ? '/sw-dev.js'  // Development service worker
                        : '/sw.js';     // Production service worker

                    const registration = await navigator.serviceWorker.register(swUrl);

                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    console.log('New content available; please refresh.');
                                    // Optional: Add more sophisticated UI notification
                                    if (window.confirm('New version available! Reload to update?')) {
                                        window.location.reload();
                                    }
                                } else {
                                    console.log('Content is cached for offline use.');
                                }
                            }
                        });
                    });

                    // Check for updates periodically
                    const updateInterval = setInterval(() => {
                        registration.update().catch(err =>
                            console.log('Failed to update service worker:', err)
                        );
                    }, 60 * 60 * 1000);

                    return () => clearInterval(updateInterval);

                } catch (error) {
                    console.error('Service worker registration failed:', error);
                }
            };

            // For development, we need to wait until the service worker is ready
            if (import.meta.env.VITE_DEV) {
                window.addEventListener('load', registerServiceWorker);
                return () => window.removeEventListener('load', registerServiceWorker);
            } else {
                // In production, we can register immediately
                registerServiceWorker();
            }
        }
    }, []);
};

export default useServiceWorker;