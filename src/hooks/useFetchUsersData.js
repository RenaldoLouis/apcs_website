import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, limit, startAt, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/DataContext';
import { isEmpty } from 'lodash';

const usePaginatedUsers = (pageSize = 10) => {
    const { user } = useAuth()

    const [userDatas, setUserDatas] = useState([]);
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
                collection(db, "users"),
                orderBy("name"),
                limit(pageSize)
            );

            if (offset > 0) {
                const initialQuery = query(
                    collection(db, "users"),
                    orderBy("name"),
                    limit(offset)
                );
                const initialSnapshot = await getDocs(initialQuery);
                const lastVisible = initialSnapshot.docs[initialSnapshot.docs.length - 1];

                q = query(
                    collection(db, "users"),
                    orderBy("name"),
                    startAt(lastVisible),
                    limit(pageSize)
                );
            }

            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

            setUserDatas(newData);

            // Calculate total documents for pagination
            if (pageNumber === 1) {
                const totalQuery = await getDocs(collection(db, "users"));
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

    return { userDatas, loading, error, page, setPage, totalPages };
};

export default usePaginatedUsers;
