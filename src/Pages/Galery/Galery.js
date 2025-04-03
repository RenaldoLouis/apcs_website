import React from "react";
import MasonryLayout from "../../components/molecules/MasonryLayout";

const Galery = (props) => {
    const { images, name } = props

    return (
        <section>
            <MasonryLayout images={images} name={name} />
            {/* <ListOfGaleryRow images={images} /> */}
        </section>
    )
}

export default Galery;