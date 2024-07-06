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
import GuestArtistCard from "../../components/molecules/GuestArtisCard";
import { CountryConst } from "../../constant/CountryConst";
import HeaderAbout from "../../components/atom/HeaderAbout";

const GuestArtist = () => {

    const guestArtistList = [
        {
            name: "Iswargia Sudarno",
            image: artist1,
            country: [CountryConst.IDN],
            // title: "Indonesia | Juries",
        },
        {
            name: "Ify Alyssa",
            image: artist2,
            country: [CountryConst.IDN],
            // title: "Indonesia | Singer",
        },
        {
            name: "Andreas Arianto",
            image: artist3,
            country: [CountryConst.IDN],
            // title: "Indonesia | Accordion",
        },
        {
            name: "Filda Salim",
            image: artist4,
            country: [CountryConst.IDN],
            // title: "Indonesia | Pianist",
        },
        {
            name: "Vahur Luhtsalu",
            image: artist5,
            country: [CountryConst.RSA],
            // title: "",
        },
        {
            name: "Nathania Jualim",
            image: artist6,
            country: [CountryConst.IDN],
            // title: "Indonesia | Guitarist",
        },
        {
            name: "Firdy Salim",
            image: artist7,
            country: [CountryConst.IDN],
            // title: "Indonesia | Juries",
        },
        {
            name: "Michaela Sutejo",
            image: artist8,
            country: [CountryConst.IDN],
            // title: "Indonesia | Pianist",
        },
        {
            name: "Christine Utomo",
            image: artist9,
            country: [CountryConst.IDN, CountryConst.CHI],
            // title: "CHI | juries",
        },
        {
            name: "Stephanie Jingga",
            image: artist10,
            country: [CountryConst.IDN],
            // title: "Indonesia | Pianist",
        },
        {
            name: "Amelia Tionanda",
            image: artist11,
            country: [CountryConst.IDN],
            // title: "Indonesia | Violin",
        },
        {
            name: "Michelle Hendra",
            image: artist12,
            country: [CountryConst.IDN],
            // title: "Indonesia | Singer",
        },
        {
            name: "Myra Karlina Pranajaya",
            image: artist13,
            country: [CountryConst.CHI, CountryConst.DNMRK],
            // title: "FIN | Juries",
        },
        {
            name: "Park Keun Woo",
            image: artist14,
            country: [CountryConst.KR],
            // title: "KR | Singer",
        },
        {
            name: "Michelle Kartika Bahari",
            image: artist15,
            country: [CountryConst.IDN],
            // title: "SG | Indonesia | Juries",
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
                                    <div className="col-12 col-md-4" style={{ padding: 50 }}>
                                        <GuestArtistCard data={eachData} />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}
export default GuestArtist;