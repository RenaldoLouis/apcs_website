import { collection, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore';
import { isEmpty } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/DataContext';
import { db } from '../firebase';

const usePaginatedContactUsSubmitted = (pageSize = 10, setIsLoading) => {
    const { loggedInUser } = useAuth()

    const [Datas, setDatas] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);

    const fetchUserData = useCallback(async (pageNumber) => {
        setIsLoading(true);
        setError(null);

        try {
            const offset = (pageNumber - 1) * pageSize;
            let q = query(
                collection(db, "conctactUsSubmitted"),
                orderBy("name"),
                limit(pageSize)
            );

            if (offset > 0) {
                const initialQuery = query(
                    collection(db, "conctactUsSubmitted"),
                    orderBy("name"),
                    limit(offset)
                );
                const initialSnapshot = await getDocs(initialQuery);
                const lastVisible = initialSnapshot.docs[initialSnapshot.docs.length - 1];

                q = query(
                    collection(db, "conctactUsSubmitted"),
                    orderBy("name"),
                    startAt(lastVisible),
                    limit(pageSize)
                );
            }

            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

            setDatas(newData);

            // Calculate total documents for pagination
            if (pageNumber === 1) {
                const totalQuery = await getDocs(collection(db, "conctactUsSubmitted"));
                setTotalDocs(totalQuery.size);
            }
        } catch (err) {
            console.error("Error getting documents: ", err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        if (!isEmpty(loggedInUser.token)) {
            fetchUserData(page);
        }
    }, [fetchUserData, page, loggedInUser.token]);

    const totalPages = Math.ceil(totalDocs / pageSize);

    return { Datas, error, page, setPage, totalPages };
};

export default usePaginatedContactUsSubmitted;
