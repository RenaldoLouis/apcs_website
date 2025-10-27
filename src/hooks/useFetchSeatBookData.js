import { collection, getDocs, query } from 'firebase/firestore'; // Use collection and getDocs
import { useCallback, useEffect, useState } from 'react';
import { db } from '../firebase';

/**
 * A custom hook to fetch a single document by its ID from a Firestore collection.
 * @param {string} collectionName - The name of the collection (e.g., 'seatBook2025').
 * @param {string} documentId - The ID of the document to fetch.
 * @returns {object} An object containing the document data, loading state, and error state.
 */
const useFetchSeatBookData = (collectionName) => {
    const [userBookData, setUserBookData] = useState([]); // Default to an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!collectionName) {
            setUserBookData([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Create a reference to the entire collection
            const collectionRef = collection(db, collectionName);
            const q = query(collectionRef); // You can add 'orderBy' here if needed

            // 2. Fetch all documents in the collection
            const querySnapshot = await getDocs(q);

            // 3. Map over the results to get an array of data
            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // documents.sort((a, b) => {
            //     // First, compare the 'seconds' in descending order
            //     if (a.createdAt.seconds !== b.createdAt.seconds) {
            //         return b.createdAt.seconds - a.createdAt.seconds;
            //     }

            //     // If seconds are the same, compare 'nanoseconds' for precision
            //     return b.createdAt.nanoseconds - a.createdAt.nanoseconds;
            // });

            // console.log("documents", documents)

            setUserBookData(documents);

        } catch (err) {
            console.error("Error getting collection:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [collectionName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { userBookData, loading, error, refetch: fetchData };
};

export default useFetchSeatBookData;