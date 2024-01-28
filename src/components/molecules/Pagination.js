import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../../firebase';

const Pagination = () => {
    const [datas, setDatas] = useState([])

    const fetchPost = async () => {
        await getDocs(collection(db, "galeries"))
            .then((querySnapshot) => {
                if (querySnapshot) {
                    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    setDatas(newData);
                }
            })
    }

    useEffect(() => {
        fetchPost();
    }, [])

    return (
        <div className="container">
            {datas && datas.length > 0 && datas.map((eachData) => {
                console.log("eachData", eachData)
                return (
                    <div>
                        {eachData.title}
                        <img src={eachData.image} alt="ghibli" />
                    </div>
                )
            })}
        </div>
    )
}

export default Pagination;