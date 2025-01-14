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
            <MasonryLayout images={images} name={name} />
            {/* <ListOfGaleryRow images={images} /> */}
        </section>
    )
}

export default Galery;








// import React from "react";

// const Galery = (props) => {
//     const { isDynamicType = false } = props

//     return (
//         <section className={"image-galleryDynamic"}>
//             <div>
//                 <img src='https://images.unsplash.com/photo-1661335996027-0a65af891c27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
//                 <img src='https://images.unsplash.com/photo-1661189626525-3d7ec5d3087c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
//                 <img src='https://images.unsplash.com/photo-1660628504006-9416dd2a411f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
//                 <img src='https://images.unsplash.com/photo-1662441896128-691f7ac658ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
//                 <img src='https://images.unsplash.com/photo-1661880374687-4ce390284f86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
//                 <img src='https://images.unsplash.com/photo-1661691111071-42c262ca061e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
//                 <img src='https://images.unsplash.com/photo-1696644542260-c0960b3b7233?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTk0NTAwMTF8&ixlib=rb-4.0.3&q=80&w=400' alt='' />
//                 <img src='https://images.unsplash.com/photo-1661435805196-81136edfa297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQxMTQ&ixlib=rb-1.2.1&q=80&w=400' alt='' />
//                 <img src='https://images.unsplash.com/photo-1660584658489-a15f806f463c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQxMTQ&ixlib=rb-1.2.1&q=80&w=400' alt='' />
//             </div>
//         </section>
//     )
// }

// export default Galery;