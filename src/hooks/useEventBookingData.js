import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

/**
 * A custom hook to fetch all necessary data for the booking page directly from Firestore.
 * @param {string} eventId - The ID of the event to fetch data for.
 * @returns {object} An object containing the event data, seats, loading state, and error state.
 */
export const useEventBookingData = (eventId) => {
    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]); // The raw list of seat documents
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Guard clause: If there's no eventId, do nothing.
        if (!eventId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Create references to the documents/collections
                const eventRef = doc(db, 'events', eventId);
                const seatsQuery = query(collection(db, `seats${eventId}`), where('eventId', '==', eventId));

                // Fetch both the event details and the seats in parallel for efficiency
                const [eventSnapshot, seatsSnapshot] = await Promise.all([
                    getDoc(eventRef),
                    getDocs(seatsQuery)
                ]);

                // Process event data
                if (eventSnapshot.exists()) {
                    setEvent({ id: eventSnapshot.id, ...eventSnapshot.data() });
                } else {
                    throw new Error("Event not found.");
                }

                // Process seats data
                const seatsData = seatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSeats(seatsData);

            } catch (err) {
                console.error("Firebase fetch error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [eventId]); // This effect re-runs whenever the eventId changes

    return { event, seats, loading, error };
};