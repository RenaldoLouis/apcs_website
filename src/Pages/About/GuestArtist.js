import React from "react";
import HeaderTitle from "../../components/atom/HeaderTitle";
import artist1 from "../../assets/images/guestArtist/artist1.png"
import artist2 from "../../assets/images/guestArtist/artist2.png"
import artist3 from "../../assets/images/guestArtist/artist3.png"
import artist4 from "../../assets/images/guestArtist/artist4.png"
import artist5 from "../../assets/images/guestArtist/artist5.png"
import artist6 from "../../assets/images/guestArtist/artist6.png"
import artist7 from "../../assets/images/guestArtist/artist7.png"
import artist8 from "../../assets/images/guestArtist/artist8.png"
import artist9 from "../../assets/images/guestArtist/artist9.png"
import artist10 from "../../assets/images/guestArtist/artist10.png"
import artist11 from "../../assets/images/guestArtist/artist11.png"
import artist12 from "../../assets/images/guestArtist/artist12.png"
import artist13 from "../../assets/images/guestArtist/artist13.png"
import artist14 from "../../assets/images/guestArtist/artist14.png"
import artist15 from "../../assets/images/guestArtist/artist15.png"
import artist16 from "../../assets/images/guestArtist/artist16.png"
import GuestArtistCard from "../../components/molecules/GuestArtisCard";
import { CountryConst } from "../../constant/CountryConst";
import HeaderAbout from "../../components/atom/HeaderAbout";
import indFlag from "../../assets/images/indFlag.jpg"
import { useAuth } from "../../context/DataContext";
import AnimatedComponent from "../../components/atom/AnimatedComponent";

const GuestArtist = () => {

    const { isSmallMobileAndSmaller } = useAuth();

    const guestArtistList = [
        {
            name: "Vahur Luhtsalu",
            image: artist5,
            country: [CountryConst.RSA],
            title: "Cellist",
        },
        {
            name: "Ify Alyssa",
            image: artist2,
            country: [CountryConst.IDN],
            title: "Singer - Pianist",
        },
        {
            name: "Andreas Arianto",
            image: artist3,
            country: [CountryConst.IDN],
            title: "Accordionist",
        },
        {
            name: "Michaela Sutejo",
            image: artist8,
            country: [CountryConst.IDN],
            title: "Pianist",
        },
        {
            name: "Filda Salim",
            image: artist4,
            country: [CountryConst.IDN],
            title: "Pianist",
        },
        {
            name: "Stephanie Jingga",
            image: artist10,
            country: [CountryConst.IDN],
            title: "Pianist",
        },
        {
            name: "Firdy Salim",
            image: artist7,
            country: [CountryConst.IDN],
            title: "Juries",
        },
        {
            name: "Amelia Tionanda",
            image: artist11,
            country: [CountryConst.IDN],
            title: "Violinist",
        },
        {
            name: "Christine Utomo",
            image: artist9,
            country: [CountryConst.IDN, CountryConst.CHI],
            title: "Pianist",
        },
        {
            name: "Michelle Kartika Bahari",
            image: artist15,
            country: [CountryConst.IDN],
            title: "Pianist",
        },
        {
            name: "Park Keun Woo",
            image: artist14,
            country: [CountryConst.KR],
            title: "Singer",
        },
        {
            name: "Michelle Hendra",
            image: artist12,
            country: [CountryConst.IDN],
            title: "Singer",
        },
        {
            name: "Myra Karlina Pranajaya",
            image: artist13,
            country: [CountryConst.CHI, CountryConst.DNMRK],
            title: "Pianist",
        },
        {
            name: "Iswargia Sudarno",
            image: artist1,
            country: [CountryConst.IDN],
            title: "Pianist",
        },
        {
            name: "Nathania Jualim",
            image: artist6,
            country: [CountryConst.IDN],
            title: "Guitarist",
        },
    ]

    return (
        <div style={{ background: "black" }} >
            <div className="container" >
                <div style={{ paddingBottom: 100, paddingTop: 100 }}>
                    <HeaderTitle >
                        <HeaderAbout title={"GUEST ARTIST"} />
                    </HeaderTitle>
                </div>
                <div style={{ color: "white" }}>
                    <div className="text-align-justify align-items-start row" style={{ paddingBottom: 36, margin: 0 }}>
                        <div className="container color-white">
                            <div className="row gx-5 gy-5">
                                {guestArtistList.map((eachData) => (
                                    <div className="col-6 col-md-4" style={{ padding: isSmallMobileAndSmaller ? 10 : 50 }}>
                                        <GuestArtistCard data={eachData} />
                                    </div>
                                ))}
                            </div>
                            <AnimatedComponent animationClass="animate__fadeIn">
                                <div className="row gx-5 gy-5">
                                    <div className="col-12 col-md-2" style={{ padding: 50 }} />
                                    <div className="col-12 col-md-8">
                                        <img src={artist16} alt="artist16" style={{ width: "100%" }} />
                                        <div className="d-flex justify-content-center" style={{ fontSize: 40, marginTop: 30 }}>
                                            CMC Choir
                                            {/* <img src={indFlag} alt={"indFlag"} style={{}} /> */}

                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12" style={{ marginTop: 0 }}>
                                        <div className="d-flex justify-content-center" style={{ fontSize: 40 }}>
                                            <img src={indFlag} alt={"indFlag"} style={{}} />

                                        </div>
                                    </div>
                                    <div className="col-12 col-md-2" style={{ padding: 50 }} />
                                </div>
                            </AnimatedComponent>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}
export default GuestArtist;