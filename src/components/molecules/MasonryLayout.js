import React, { useEffect, useState } from "react";
import Masonry from './Masonry'
// import Masonry as Masonry from 'react-masonry-css';


const MasonryLayout = (props) => {
    const { images } = props
    const [imagesData, setImagesData] = useState([])


    useEffect(() => {
        if (images) {
            let promises = images.map((image, index) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = image;
                    img.onload = () => {

                        let tempObj = {
                            id: index + 1,
                            image: image,
                            height: img.height
                        };
                        resolve(tempObj);
                    };
                });
            });

            Promise.all(promises).then((tempData) => {
                setImagesData(tempData);
            });
        }
    }, [images])

    return (
        <div style={{ justifyContent: "center" }}>
            <Masonry data={imagesData} />
        </div>
    );
};

export default MasonryLayout;
