import React from "react";
import HeaderTitle from "../../components/atom/HeaderTitle";
import jurist1 from "../../assets/images/jurists/jurist1.png"

const GuestArtist = () => {

    const guestArtistList = [
        {
            image: jurist1,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist1,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist1,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist1,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist1,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist1,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
    ]

    return (
        <div style={{ background: "black" }} >
            <div className="container" >
                <div style={{ paddingBottom: 100, paddingTop: 100 }}>
                    <HeaderTitle >
                        Guest Artist
                    </HeaderTitle>
                </div>
                <div style={{ color: "white" }}>
                    <div className="text-align-justify align-items-start row" style={{ paddingBottom: 36 }}>
                        {guestArtistList.map((eachData) => {
                            return (
                                <div className="col" style={{ marginBottom: 60 }}>
                                    <img loading="lazy" src={eachData.image} alt="jurist1" style={{ marginBottom: "1.25rem" }} />
                                    <div>
                                        {eachData.name}
                                    </div>
                                    <div>
                                        {eachData.title}
                                    </div>
                                    <div>
                                        {eachData.quote}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div >
    )
}
export default GuestArtist;