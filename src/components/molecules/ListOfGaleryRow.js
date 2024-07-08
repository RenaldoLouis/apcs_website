import React from "react";
import AnimatedComponent from "../atom/AnimatedComponent";

const ListOfGaleryRow = (props) => {
    const { images } = props;

    // Split images into chunks of 3
    const chunkedImages = images?.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 3);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);

    return (
        <div className="gallery-container">
            {chunkedImages?.map((row, rowIndex) => (
                <div key={rowIndex} className="gallery-row">
                    {row.map((item, colIndex) => (
                        <div key={colIndex} className="gallery-item">
                            <AnimatedComponent animationClass="animate__fadeIn" triggerOnce={false}>
                                <img src={item} alt={`gallery-${rowIndex}-${colIndex}`} className="gallery-img" />
                            </AnimatedComponent>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ListOfGaleryRow;