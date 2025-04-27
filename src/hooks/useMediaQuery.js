// src/hooks/useMediaQuery.js
import { useEffect, useState } from 'react';

export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);

        media.addListener(listener);
        return () => media.removeListener(listener);
    }, [query]);

    return matches;
};
