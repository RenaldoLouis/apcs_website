import { doc, getDoc } from 'firebase/firestore'; // The imports are correct for getting a single doc
import { useCallback, useEffect, useState } from 'react';
import { db } from '../firebase';

/**
 * A custom hook to fetch a single document by its ID from a Firestore collection.
 * @param {string} collectionName - The name of the collection (e.g., 'seatBook2025').
 * @param {string} documentId - The ID of the document to fetch.
 * @returns {object} An object containing the document data, loading state, and error state.
 */
const useFetchSeatBookData = (collectionName, documentId) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!documentId) {
            setUserData(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const docRef = doc(db, collectionName, documentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // --- THIS IS THE FIX ---
                // Changed from the incorrect 'docSnap.userData()' to the correct 'docSnap.data()'
                setUserData({ id: docSnap.id, ...docSnap.data() });
            } else {
                setError("Document not found.");
                setUserData(null);
            }
        } catch (err) {
            console.error("Error getting document:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [collectionName, documentId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { userData, loading, error, refetch: fetchData };
};

export default useFetchSeatBookData;