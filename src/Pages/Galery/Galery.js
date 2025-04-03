import React, { useEffect } from "react";
import MasonryLayout from "../../components/molecules/MasonryLayout";

const Galery = (props) => {
    const { images, name, setIsLoadingPictures, isLoadingPictures } = props

    return (
        <section>
            <MasonryLayout images={images} name={name} setIsLoadingPictures={setIsLoadingPictures} isLoadingPictures={isLoadingPictures} />
        </section>
    )
}

export default Galery;