import React, { useCallback, useEffect, useState } from "react";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';

import Masonry from 'react-masonry-css';
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

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 2
    };

    let displayStyle = (index) => {
        switch (name) {
            case YearlyEvent.TURNINGPOINT:
                return index === 33 ? "none" : ""
            case YearlyEvent.CLASSICALFESTIVALJKT2024:
                return index === 18 ? "none" : ""
                break
            case YearlyEvent.AUTUMINKOREA:
                return index === 33 ? "none" : ""
            case YearlyEvent.CLASSICALFESTIVALSBY:
                return index === 30 ? "none" : ""
            case YearlyEvent.CHRISTMASWONDERLAND:
                return index === 33 ? "none" : ""
            case YearlyEvent.CLASSICALFESTIVALJKT:
                return index === 33 ? "none" : ""
            case YearlyEvent.MASTERCLASS:
                return index === 21 ? "none" : ""
            default:
            // code block
        }
    }

    let marginBottomGalery = (index) => {
        switch (name) {
            case YearlyEvent.AUTUMINKOREA:
                if (index === 27) {
                    return 20
                }
                else if (index === 24) {
                    return 20
                }
                else if (index === 21) {
                    return 20
                }
                break;
            case YearlyEvent.CLASSICALFESTIVALSBY:
                if (index === 27) {
                    return 40
                }
                else if (index === 24) {
                    return 35
                }
                else if (index === 21) {
                    return 40
                }
                break;
            case YearlyEvent.CHRISTMASWONDERLAND:
                if (index === 27) {
                    return 40
                }
                else if (index === 24) {
                    return 40
                }
                else if (index === 21) {
                    return 50
                }
                else if (index === 18) {
                    return 50
                }
                break;
            case YearlyEvent.MASTERCLASS:
                if (index === 3) {
                    return 20
                }
                if (index === 6) {
                    return 30
                }
                else if (index === 4) {
                    return 20
                }
                else if (index === 7) {
                    return 20
                }
                break;
            // case YearlyEvent.CLASSICALFESTIVALJKT2024:
            //     if (index === 17) {
            //         return 30
            //     }
            //     if (index === 8) {
            //         return 30
            //     }
            //     else if (index === 14) {
            //         return 30
            //     }
            //     else if (index === 17) {
            //         return 30
            //     }
            //     else if (index === 15) {
            //         return 30
            //     }
            //     else if (index === 9) {
            //         return 30
            //     }
            //     break;
            case YearlyEvent.MAGICALMUSICSOUNDTRACT:
                if (index === 27) {
                    return 40
                }
                else if (index === 24) {
                    return 40
                }
                else if (index === 21) {
                    return 40
                }
                else if (index === 18) {
                    return 40
                }
                else if (index === 31) {
                    return 35
                }
                else if (index === 28) {
                    return 35
                }
                else if (index === 19) {
                    return 35
                }
                break;
            default:
            // code block
        }
    }

    return (
        <div style={{ justifyContent: "center" }}>
            {/* <InfiniteScroll
                dataLength={items.length}
                next={fetchPost}
                hasMore={hasMore}
                loader={<Spin tip="Loading" />}
                endMessage={""}
                style={{
                    overflow: 'hidden',
                }}
            > */}
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {images?.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`masonry-item ${hoveredIndex === index ? 'hovered' : ''}`}
                            style={{ display: displayStyle(index) }}
                        // onMouseEnter={() => setHoveredIndex(index)}
                        // onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <AnimatedComponent animationClass="animate__fadeIn" triggerOnce={false} >
                                <img src={item} alt={`galery-${index}`} className="masonry-img" style={{ paddingBottom: marginBottomGalery(index) }} />
                                {/* <div style={{ color: "white" }}>{index + 1}</div> */}
                            </AnimatedComponent>
                        </div>
                    )
                })}
            </Masonry>
            {/* </InfiniteScroll> */}

        </div>
    );
};

export default MasonryLayout;
