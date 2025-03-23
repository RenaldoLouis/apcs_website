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
    const [allData, setAllData] = useState(0);

    const fetchUserData = useCallback(async (pageNumber, collectionName = "Registrants") => {
        setLoading(true);
        setError(null);

        try {
            const offset = (pageNumber - 1) * pageSize;
            let q = query(
                collection(db, collectionName),
                orderBy("achievement"),
                limit(pageSize)
            );

            if (offset > 0) {
                const initialQuery = query(
                    collection(db, collectionName),
                    orderBy("achievement"),
                    limit(offset)
                );
                const initialSnapshot = await getDocs(initialQuery);
                const lastVisible = initialSnapshot.docs[initialSnapshot.docs.length - 1];

                q = query(
                    collection(db, collectionName),
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
                const totalQuery = await getDocs(collection(db, collectionName));
                setTotalDocs(totalQuery.size);

                const newData = totalQuery.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setAllData(newData);
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

    return { registrantDatas, loading, error, page, setPage, totalPages, totalDocs, allData };
};

export default usePaginatedRegistrants;
