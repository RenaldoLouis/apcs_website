import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { cloneDeep, isEmpty } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/DataContext';
import { db } from '../firebase';

const usePaginatedRegistrants = (pageSize = 10, collectionName = "Registrants", orderData = "createdAt", searchTerm = "") => {
    const { user } = useAuth();

    // State to hold all documents fetched from Firestore
    const [allData, setAllData] = useState([]);
    // State to hold the final, displayed data (after filtering and pagination)
    const [registrantDatas, setRegistrantDatas] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);

    // This function now only fetches ALL data from Firestore ONCE.
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, collectionName), orderBy(orderData));
            const querySnapshot = await getDocs(q);
            const allDocs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

            // Perform the 'paymentStatus' mapping once on the full dataset
            const processedData = allDocs.map((eachData) => {
                const tempData = cloneDeep(eachData);
                if (!tempData.paymentStatus) {
                    tempData.paymentStatus = "PAID";
                }
                return tempData;
            });

            setAllData(processedData);
        } catch (err) {
            console.error("Error getting documents: ", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [collectionName, orderData]);

    // Initial data fetch
    useEffect(() => {
        if (!isEmpty(user.token)) {
            fetchData();
        }
    }, [user.token, fetchData]);

    // This new useEffect handles filtering and pagination whenever the search term or page changes.
    useEffect(() => {
        // Start with the full, original dataset
        let filteredData = allData;

        // Apply search filter if a search term exists
        if (searchTerm && allData.length > 0) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filteredData = allData.filter(registrant => {
                // Check each performer in the performers array
                return registrant.performers?.some(performer => {
                    const fullName = `${performer.firstName || ''} ${performer.lastName || ''}`.toLowerCase();
                    return fullName.includes(lowercasedFilter);
                });
            });
        }

        // Update the total documents count based on the filtered results
        setTotalDocs(filteredData.length);

        // Apply pagination to the filtered data
        const offset = (page - 1) * pageSize;
        const paginatedData = filteredData.slice(offset, offset + pageSize);

        setRegistrantDatas(paginatedData);

    }, [searchTerm, page, allData, pageSize]); // Re-run when search, page, or data changes

    const totalPages = Math.ceil(totalDocs / pageSize);

    return { allData, registrantDatas, loading, error, page, setPage, totalPages, totalDocs, fetchData };
};

export default usePaginatedRegistrants;