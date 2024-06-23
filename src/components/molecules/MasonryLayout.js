import React, { useCallback, useEffect, useState } from "react";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';

import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';

const MasonryLayout = () => {
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isGetLatestImage, setIsGetLatestImage] = useState(false);

    let latestData = null

    const fetchPost = useCallback(async () => {
        if (!isGetLatestImage && latestData !== undefined) {
            const q = query(collection(db, "galeryTurningPoint"), orderBy("order"), startAfter(latestData || 0), limit(2));

            await getDocs(q)
                .then((querySnapshot) => {
                    if (querySnapshot) {
                        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                        if (newData.length === 0) {
                            setIsGetLatestImage(true)
                            setHasMore(false)
                        } else {
                            setHasMore(true)
                        }
                        setItems((prevState) => [...prevState, ...newData]);
                        latestData = querySnapshot.docs[querySnapshot.docs.length - 1]
                    }
                })
                .catch((error) => {
                    console.error("Error getting documents: ", error);
                });
        }
    }, [])

    useEffect(() => {
        fetchPost();
    }, [fetchPost])

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={fetchPost}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>All items loaded</p>}
        >
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {items.map((item, index) => (
                    <div key={index} className="masonry-item">
                        <img loading="lazy" src={item.image} alt={item.title} />
                        <p>{item.title}</p>
                    </div>
                ))}
            </Masonry>
        </InfiniteScroll>
    );
};

export default MasonryLayout;
