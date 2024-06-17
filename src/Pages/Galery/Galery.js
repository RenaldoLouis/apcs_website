import React, { useCallback, useEffect, useRef, useState } from "react";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';

const Galery = (props) => {
    const { isDynamicType = false } = props

    const [datas, setDatas] = useState([])
    const [chunkedDatas, setChunkedDatas] = useState([])
    const [isGetLatestImage, setIsGetLatestImage] = useState(false);

    const [animatedKeys, setAnimatedKeys] = useState([]);

    useEffect(() => {
        // Determine new keys that need to be animated
        const newKeys = datas.map(data => data.title);

        // Filter out keys that were already animated
        const keysToAnimate = newKeys.filter(key => !animatedKeys.includes(key));

        // Set keys to animate
        setAnimatedKeys([...animatedKeys, ...keysToAnimate]);

        // Reset animation after 500ms (same as transition duration)
        const timer = setTimeout(() => {
            setAnimatedKeys([]);
        }, 500);

        return () => clearTimeout(timer);
    }, [datas]);

    let latestData = null

    const imageThresholdRef = useRef(null);

    const chunkArray = (array, size) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArray.push(array.slice(i, i + size));
        }
        return chunkedArray;
    };

    useEffect(() => {
        if (datas.length > 0) {
            const chunkedImages = chunkArray(datas, 3);
            setChunkedDatas(chunkedImages)
        }
    }, [datas])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log('Element is in view!');
                        fetchPost();
                    }
                });
            },
            {
                root: null, // Use the viewport as the root
                rootMargin: '0px',
                threshold: 0.1, // Trigger when 10% of the element is in view
            }
        );

        if (imageThresholdRef.current) {
            observer.observe(imageThresholdRef.current);
        }

        // Clean up the observer on component unmount
        return () => {
            if (imageThresholdRef.current) {
                observer.unobserve(imageThresholdRef.current);
            }
        };
    }, []);

    const fetchPost = useCallback(async () => {
        if (!isGetLatestImage && latestData !== undefined) {
            const q = query(collection(db, "galeryTurningPoint"), orderBy("order"), startAfter(latestData || 0), limit(3));

            await getDocs(q)
                .then((querySnapshot) => {
                    if (querySnapshot) {
                        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                        if (newData.length === 0) {
                            setIsGetLatestImage(true)
                        }
                        setDatas((prevState) => [...prevState, ...newData]);
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

    console.log('datas', datas)
    console.log('animatedKeys', animatedKeys)

    return (
        <section>
            <div className={isDynamicType ? "image-galleryDynamic" : "image-gallery"}>
                <div>
                    {datas && datas.length > 0 && datas.map((eachData, index) => {
                        return (
                            <img
                                // className={animatedKeys.includes(eachData.title) ? 'image-fade-in fade-in' : ''}
                                // style={{ transitionDelay: `${index * 100}ms` }} // Delay each image slightly
                                key={eachData.title} src={eachData.image} alt={eachData.title} />
                        )
                    })}
                </div>
            </div>
            <div ref={imageThresholdRef} id="imageThreshold" />

            {/* <div class="image-gallery">
                {chunkedDatas && chunkedDatas.length > 0 && chunkedDatas.map((column, columnIndex) => (
                    <div className="column" key={columnIndex}>
                        {column.map((src, index) => (
                            <div className="image-item" key={index}>
                                <img src={src.image} alt={`Image ${columnIndex}-${index}`} />
                            </div>
                        ))}
                    </div>
                ))}

                <div ref={imageThresholdRef} id="imageThreshold" />
            </div> */}
        </section>
    )
}

export default Galery;