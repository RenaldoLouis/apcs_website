import { useEffect, useRef } from 'react';

export default function YoutubeDurationFetcher({ videoId, onDurationFetched }) {
    const playerRef = useRef(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        if (!videoId) return;

        // Only define once
        if (typeof window !== 'undefined' && !scriptLoadedRef.current) {
            // Define the callback BEFORE the script loads
            window.onYouTubeIframeAPIReady = () => {
                playerRef.current = new window.YT.Player('hidden-player', {
                    videoId,
                    events: {
                        onReady: (event) => {
                            const duration = event.target.getDuration();
                            onDurationFetched(duration);
                        }
                    }
                });
            };

            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            scriptLoadedRef.current = true;
        } else if (window.YT && window.YT.Player) {
            // API already loaded — create player directly
            playerRef.current = new window.YT.Player('hidden-player', {
                videoId,
                events: {
                    onReady: (event) => {
                        const duration = event.target.getDuration();
                        onDurationFetched(duration);
                    }
                }
            });
        }
    }, [videoId]);

    return (
        <div style={{ display: 'none' }}>
            <div id="hidden-player" />
        </div>
    );
}
