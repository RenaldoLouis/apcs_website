import React, { useCallback, useEffect, useState } from "react";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';

import Masonry from './Masonry'
// import Masonry as Masonry from 'react-masonry-css';

import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin } from "antd";
import AnimatedComponent from "../atom/AnimatedComponent";
import { YearlyEvent } from "../../constant/YearlyEvent";

const MasonryLayout = (props) => {
    const { images, name } = props
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isGetLatestImage, setIsGetLatestImage] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [imagesData, setImagesData] = useState([])

    let latestData = null

    // const fetchPost = useCallback(async () => {
    //     if (!isGetLatestImage && latestData !== undefined) {
    //         const q = query(collection(db, "galeryTurningPoint"), orderBy("order"), startAfter(latestData || 0), limit(2));

    //         await getDocs(q)
    //             .then((querySnapshot) => {
    //                 if (querySnapshot) {
    //                     const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    //                     if (newData.length === 0) {
    //                         setIsGetLatestImage(true)
    //                         setHasMore(false)
    //                     } else {
    //                         setHasMore(true)
    //                     }
    //                     setItems((prevState) => [...prevState, ...newData]);
    //                     latestData = querySnapshot.docs[querySnapshot.docs.length - 1]
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error("Error getting documents: ", error);
    //             });
    //     }
    // }, [])

    // useEffect(() => {
    //     fetchPost();
    // }, [fetchPost])

    useEffect(() => {
        if (images) {
            let tempData = []
            images.forEach((image, index) => {
                let isLongImage = false
                if (index % 2 === 1) {
                    isLongImage = true
                } else {

                }

                let tempObj = {
                    id: index + 1, image: image,
                    height: isLongImage ? 600 : 1200
                }
                tempData.push(tempObj)
            });
            setImagesData(tempData)
        }
    }, [images])

    return (
        <div style={{ justifyContent: "center" }}>
            <Masonry data={imagesData} />
        </div>
    );
};

export default MasonryLayout;
