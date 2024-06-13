import React from "react";
import wishnuProfile from "../../assets/images/wishnuProfile.svg"
import HeaderTitle from "../../components/atom/HeaderTitle";

const NotableConductors = () => {

    return (
        <div className="NotableConductorContainer" style={{ background: "black" }}>
            <div className="container" >
                <div style={{ paddingTop: 153 }}>
                    <HeaderTitle>
                        Notable <br /> Conductor
                    </HeaderTitle>
                </div>
                <div className="text-align-center align-items-center row" style={{ paddingTop: 10, paddingBottom: 120 }}>
                    <div className="col" style={{ color: "white" }}>
                        <div className="mangolaineFont lineHeightNormal text-align-justify" style={{ fontSize: 40 }}>
                            WISHNU DEWANTA
                        </div>
                        <div className="text-align-justify">
                            Wishnu Dewanta is a dynamic force in musical theatre, known for his exceptional talent and dedication as a music director. With a passion for storytelling through music, he captivates audiences with innovative arrangements and impeccable musical direction.
                        </div>

                        <div className="text-align-justify">
                            apcs 2019<br />
                            the initial turning point
                        </div>
                    </div>
                    <div className="col" style={{ color: "white" }}>
                        <img src={wishnuProfile} style={{ width: "100%", height: "100%" }} alt="" />
                    </div>
                </div>
                <div className="text-align-center align-items-center row" style={{ paddingTop: 120, paddingBottom: 120 }}>
                    <div className="col" style={{ color: "white" }}>
                        <img style={{ width: "100%", height: 522 }} alt="" />
                    </div>
                    <div className="col" style={{ color: "white" }}>
                        <div>

                        </div>
                        <div>
                            Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default NotableConductors