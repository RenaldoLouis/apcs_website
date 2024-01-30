import React, { useEffect, useRef, useState } from "react";
import { collection, addDoc, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';

const Pagination = () => {
    const containerRef = useRef();

    const [datas, setDatas] = useState([])
    // const [latestData, setLatestData] = useState(null)
    const [isGetLatestImage, setIsGetLatestImage] = useState(false);

    let latestData = null

    const fetchPost = async () => {
        if (!isGetLatestImage && latestData !== undefined) {
            const q = query(collection(db, "galeries"), orderBy("order"), startAfter(latestData || 0), limit(3));

            await getDocs(q)
                .then((querySnapshot) => {
                    if (querySnapshot) {
                        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                        if (newData.length === 0) {
                            setIsGetLatestImage(true)
                        }
                        setDatas((prevState) => [...prevState, ...newData]);
                        console.log("querySnapshot.docs", querySnapshot.docs[querySnapshot.docs.length - 1])
                        // setLatestData(querySnapshot.docs[querySnapshot.docs.length - 1])
                        latestData = querySnapshot.docs[querySnapshot.docs.length - 1]
                    }
                })
                .catch((error) => {
                    console.error("Error getting documents: ", error);
                });
        }
    }

    useEffect(() => {
        fetchPost();
    }, [])

    useEffect(() => {
        const container = containerRef.current;

        const handleScroll = () => {
            const isAtBottom = container.scrollTop + container.clientHeight === container.scrollHeight;

            if (isAtBottom) {
                fetchPost();
            }
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLoadMore = () => {
        fetchPost();
    }

    return (
<<<<<<< HEAD
        <div ref={containerRef} className="container" style={{ maxHeight: "1500px", overflow: "auto" }}>
=======
        <div className="container galeryContainer">
>>>>>>> 5f35dd5 (update ui)
                {datas && datas.length > 0 && datas.map((eachData) => {
                    return (
                        <div style={{ background: "red", margin: 15 }}>
                            {eachData.title}
                            <img src={eachData.image} alt="ghibli" style={{ width: 305, height: 250 }} />
                        </div>
                    )
                })}
                <div>
                    <button onClick={() => handleLoadMore()}>
                        Load More
                    </button>
                </div>
            </div>
            )
}

            export default Pagination;