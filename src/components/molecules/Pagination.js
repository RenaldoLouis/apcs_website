import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../../firebase';

const Pagination = () => {
    const [datas, setDatas] = useState([])

    const fetchPost = async () => {
        await getDocs(collection(db, "reviews"))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setDatas(newData);
            })
    }

    // useEffect(() => {
    //     fetchPost();
    // }, [])

    return (
        <div>
            asd
        </div>
    )
}

export default Pagination;