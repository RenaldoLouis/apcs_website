import React, { useEffect, useState } from "react";
import Masonry from './Masonry'

const MasonryLayout = (props) => {
    const { images, setIsLoadingPictures, isLoadingPictures } = props
    const [imagesData, setImagesData] = useState([])


    useEffect(() => {
        if (images) {
            let promises = images.map((image, index) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = image;
                    img.onload = () => {
                        let aspectRatio = img.height / img.width; // Calculate aspect ratio

                        let tempObj = {
                            id: index + 1,
                            image: image,
                            height: img.height,
                            aspectRatio: aspectRatio, // Store aspect ratio
                        };
                        resolve(tempObj);

                        if (index === images.length - 1) {
                            setIsLoadingPictures(false);
                        }
                    };
                });
            });

            Promise.all(promises).then((tempData) => {
                setImagesData(tempData);
            });
        }
    }, [images])

    return (
        !isLoadingPictures && (
            <div style={{ justifyContent: "center" }}>
                <Masonry data={imagesData} />
            </div>
        )
    );
};

export default MasonryLayout;
