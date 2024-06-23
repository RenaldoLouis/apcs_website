import React, { useCallback, useEffect, useRef, useState } from "react";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';
import MasonryLayout from "../../components/molecules/MasonryLayout";

const Galery = (props) => {
    const { isDynamicType = false } = props

    const [datas, setDatas] = useState([])
    const [isGetLatestImage, setIsGetLatestImage] = useState(false);

    let latestData = null

    const imageThresholdRef = useRef(null);

    useEffect(() => {
        if (datas.length > 0) {

            let tempPhotos = []
            datas.forEach((eachData) => {
                let tempObject = {
                    src: eachData.image,
                    // width: "100%",
                    // height: "100%",
                }
                tempPhotos.push(tempObject)
            })
        }
    }, [datas])

    const fetchPost = useCallback(async () => {
        if (!isGetLatestImage && latestData !== undefined) {
            const q = query(collection(db, "galeryTurningPoint"), orderBy("order"), startAfter(latestData || 0), limit(2));

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

    return (
        <section>
            <MasonryLayout />
            {/* <div className={isDynamicType ? "image-galleryDynamic" : "image-gallery"}>
                <div>
                    {datas && datas.length > 0 && datas.map((eachData, index) => {
                        return (
                            <img loading="lazy"
                                // className={animatedKeys.includes(eachData.title) ? 'image-fade-in fade-in' : ''}
                                // style={{ transitionDelay: `${index * 100}ms` }} // Delay each image slightly
                                key={eachData.title} src={eachData.image} alt={eachData.title} />
                        )
                    })}
                </div>
            </div>
            <PhotoAlbum layout="masonry" photos={galeryPhotos} />;
            <div ref={imageThresholdRef} id="imageThreshold" /> */}

            {/* <div class="container">
                <div class="row text-align-center">
                    <div class="col-sm">
                        <img loading="lazy" src="https://firebasestorage.googleapis.com/v0/b/apcs-profile.appspot.com/o/APCS_TP%2FTP1.png?alt=media&token=bc65e785-acab-4355-93b2-4b420b50559a"/>
                    </div>
                    <div class="col-sm">
                       <img loading="lazy" src="https://firebasestorage.googleapis.com/v0/b/apcs-profile.appspot.com/o/APCS_TP%2FTP2.png?alt=media&token=910eea24-331b-4099-a26e-83e84b1e2ee5"/>
                    </div>
                    <div class="col-sm">
                        <img loading="lazy" src="https://firebasestorage.googleapis.com/v0/b/apcs-profile.appspot.com/o/APCS_TP%2FTP5.png?alt=media&token=ed1caf83-824a-493d-b7d0-75ca53161c28"/>
                    </div>
                </div>
            </div> */}

            {/* <div class="image-gallery">
                {chunkedDatas && chunkedDatas.length > 0 && chunkedDatas.map((column, columnIndex) => (
                    <div className="column" key={columnIndex}>
                        {column.map((src, index) => (
                            <div className="image-item" key={index}>
                                <img loading="lazy" src={src.image} alt={`Image ${columnIndex}-${index}`} />
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