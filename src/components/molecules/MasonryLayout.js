import { useEffect, useState } from "react";
import Masonry from './Masonry';

const MasonryLayout = (props) => {
    const { images, setIsLoadingPictures, isLoadingPictures } = props
    const [imagesData, setImagesData] = useState([])

    useEffect(() => {
        if (images && images.length > 0) {
            setIsLoadingPictures(true); // Set loading to true when starting

            let promises = images.map((image, index) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = image;

                    img.onload = () => {
                        let aspectRatio = img.height / img.width;

                        let tempObj = {
                            id: index + 1,
                            image: image,
                            height: img.height,
                            aspectRatio: aspectRatio,
                        };
                        resolve(tempObj);
                    };

                    img.onerror = () => {
                        console.error(`Failed to load image at index ${index}`);
                        // Resolve with null or placeholder data instead of rejecting
                        resolve({
                            id: index + 1,
                            image: image,
                            height: 0,
                            aspectRatio: 1,
                            error: true
                        });
                    };
                });
            });

            Promise.all(promises).then((tempData) => {
                setImagesData(tempData);
                setIsLoadingPictures(false); // This is the correct place!
            }).catch((error) => {
                setIsLoadingPictures(false); // Also set to false on error
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
