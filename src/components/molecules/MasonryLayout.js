import React, { useCallback, useEffect, useState } from "react";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';

import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin } from "antd";
import { turningPointImages } from "../../constant/GaleryImages";

const MasonryLayout = () => {
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isGetLatestImage, setIsGetLatestImage] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

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
        1100: 1,
        700: 1
    };

    return (
        <div style={{ justifyContent: "center" }}>
            <InfiniteScroll
                dataLength={items.length}
                next={fetchPost}
                hasMore={hasMore}
                loader={<Spin tip="Loading" />}
                endMessage={""}
                style={{
                    overflow: 'hidden',
                }}
            >
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={`masonry-item ${hoveredIndex === index ? 'hovered' : ''}`}
                        // onMouseEnter={() => setHoveredIndex(index)}
                        // onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <img src={item.image} alt={`galery-${index}`} className="masonry-img" />
                        </div>
                    ))}
                </Masonry>
            </InfiniteScroll>

        </div>
    );
};

export default MasonryLayout;
