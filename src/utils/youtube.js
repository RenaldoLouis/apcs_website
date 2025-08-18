// This variable will ensure the YouTube API script is only loaded once per page.
let youtubeApiPromise = null;

/**
 * Loads the YouTube Iframe Player API script.
 * @returns {Promise<void>} A promise that resolves when the API is ready.
 */
function loadYouTubeApi() {
    if (!youtubeApiPromise) {
        youtubeApiPromise = new Promise((resolve) => {
            // If the API is already loaded, resolve immediately.
            if (window.YT && window.YT.Player) {
                resolve();
                return;
            }

            // Define the global callback that the script will trigger when ready.
            window.onYouTubeIframeAPIReady = () => {
                resolve();
            };

            // Inject the API script into the document.
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        });
    }
    return youtubeApiPromise;
}

/**
 * Fetches the duration of a YouTube video by creating a temporary hidden player.
 * This function is a promisified version of your YoutubeDurationFetcher component's logic.
 * @param {string} videoId The 11-character YouTube video ID.
 * @returns {Promise<number|null>} The duration in seconds, or null if an error occurs.
 */
export const fetchYouTubeDuration = async (videoId) => {
    if (!videoId) return null;

    try {
        // First, ensure the YouTube API script is loaded and ready.
        await loadYouTubeApi();

        return new Promise((resolve, reject) => {
            // Create a unique ID for a temporary div to host the player.
            const tempPlayerId = `temp-player-${videoId}-${Date.now()}`;
            const playerDiv = document.createElement('div');
            playerDiv.id = tempPlayerId;
            playerDiv.style.display = 'none'; // Keep it hidden
            document.body.appendChild(playerDiv);

            let player;
            const timeoutId = setTimeout(() => {
                // Failsafe: if the player takes too long to load (e.g., private video), reject.
                console.error(`Timeout fetching duration for video ID: ${videoId}`);
                player?.destroy();
                document.body.removeChild(playerDiv);
                resolve(null); // Resolve with null instead of rejecting to not stop the whole batch
            }, 3000); // 10-second timeout

            player = new window.YT.Player(tempPlayerId, {
                videoId: videoId,
                events: {
                    onReady: (event) => {
                        clearTimeout(timeoutId);
                        const duration = event.target.getDuration();
                        resolve(Math.round(duration)); // Success! Resolve the promise with the duration.

                        // Clean up the player and the temporary div from the DOM.
                        player.destroy();
                        document.body.removeChild(playerDiv);
                    },
                    onError: (event) => {
                        clearTimeout(timeoutId);
                        console.error(`Youtubeer Error for video ID ${videoId}:`, event.data);
                        resolve(null); // Resolve with null to continue the batch process.

                        // Clean up.
                        player.destroy();
                        document.body.removeChild(playerDiv);
                    }
                }
            });
        });
    } catch (error) {
        console.error(`General error fetching duration for ${videoId}:`, error);
        return null;
    }
};

/**
 * Extracts the YouTube video ID from various URL formats.
 * @param {string} url The full YouTube URL.
 * @returns {string|null} The 11-character video ID.
 */
export const extractVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};