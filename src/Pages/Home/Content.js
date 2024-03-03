import React from "react";
import CoverImage from "./CoverImage";
import CardHover from "../../components/molecules/CardHover";
import CarouselCustom from "../../components/molecules/CarouselCustom";

const Content = (props) => {
    const { audio } = props

    return (
        <section>
            <CoverImage
                audio={audio}
            />

            <CardHover />

            <CarouselCustom
                images={[
                    "https://speakzeasy.files.wordpress.com/2015/05/twa_blogpic_timisoara-4415.jpg", "https://content.r9cdn.net/rimg/dimg/db/02/06b291e8-city-14912-171317ad83a.jpg?width=1750&height=1000&xhint=3040&yhint=2553&crop=true", "https://upload.wikimedia.org/wikipedia/commons/9/9e/Timisoara_-_Regional_Business_Centre.jpg"
                ]}
            />

            <article className="container">
                <div className="row">
                    <div className="col">
                        1 of 2
                    </div>
                    <div className="col">
                        2 of 2
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        1 of 3
                    </div>
                    <div className="col">
                        2 of 3
                    </div>
                    <div className="col">
                        3 of 3
                    </div>
                </div>

                <div className="row">
                    <div className="col align-self-start">
                        One of three columns
                    </div>
                    <div className="col align-self-center">
                        One of three columns
                    </div>
                    <div className="col align-self-end">
                        One of three columns
                    </div>
                </div>
            </article>
        </section>
    )
}

export default Content;