import React, { useCallback, useEffect, useRef, useState } from "react";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from '../../firebase';
import MasonryLayout from "../../components/molecules/MasonryLayout";
import ListOfGaleryRow from "../../components/molecules/ListOfGaleryRow";

const Galery = (props) => {
    const { isDynamicType = false, images, name } = props

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

    // const fetchPost = useCallback(async () => {
    //     if (!isGetLatestImage && latestData !== undefined) {
    //         const q = query(collection(db, "galeryTurningPoint"), orderBy("order"), startAfter(latestData || 0), limit(2));

    //         await getDocs(q)
    //             .then((querySnapshot) => {
    //                 if (querySnapshot) {
    //                     const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    //                     if (newData.length === 0) {
    //                         setIsGetLatestImage(true)
    //                     }
    //                     setDatas((prevState) => [...prevState, ...newData]);
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

    return (
        <section>
            <MasonryLayout images={images} name={name} />
            {/* <ListOfGaleryRow images={images} /> */}
        </section>
    )
}

export default Galery;