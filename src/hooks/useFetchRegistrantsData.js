import { collection, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore';
import { isEmpty } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/DataContext';
import { db } from '../firebase';

const usePaginatedRegistrants = (pageSize = 10) => {
    const { user } = useAuth()

    const [registrantDatas, setRegistrantDatas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);

    const fetchUserData = useCallback(async (pageNumber) => {
        setLoading(true);
        setError(null);

        try {
            const offset = (pageNumber - 1) * pageSize;
            let q = query(
                collection(db, "Registrants"),
                orderBy("achievement"),
                limit(pageSize)
            );

            if (offset > 0) {
                const initialQuery = query(
                    collection(db, "Registrants"),
                    orderBy("achievement"),
                    limit(offset)
                );
                const initialSnapshot = await getDocs(initialQuery);
                const lastVisible = initialSnapshot.docs[initialSnapshot.docs.length - 1];

                q = query(
                    collection(db, "Registrants"),
                    orderBy("achievement"),
                    startAt(lastVisible),
                    limit(pageSize)
                );
            }

            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

            setRegistrantDatas(newData);

            // Calculate total documents for pagination
            if (pageNumber === 1) {
                const totalQuery = await getDocs(collection(db, "Registrants"));
                setTotalDocs(totalQuery.size);
            }
        } catch (err) {
            console.error("Error getting documents: ", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        if (!isEmpty(user.token)) {
            fetchUserData(page);
        }
    }, [fetchUserData, page, user.token]);

    const totalPages = Math.ceil(totalDocs / pageSize);

    return { registrantDatas, loading, error, page, setPage, totalPages, totalDocs };
};

export default usePaginatedRegistrants;
