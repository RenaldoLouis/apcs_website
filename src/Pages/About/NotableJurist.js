import React from "react";
import HeaderTitle from "../../components/atom/HeaderTitle";
import wishnuProfile from "../../assets/images/wishnuProfile.svg"
import jurist1 from "../../assets/images/jurists/jurist1.svg"

const NotableJurist = () => {

    const juristList = [
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
                <HeaderTitle>
                    Our Notable <br /> Jurist
                </HeaderTitle>
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
                        <img loading="lazy" src={wishnuProfile} style={{ width: "100%", height: "100%" }} alt="" />
                    </div>
                </div>
                <div style={{ color: "white" }}>
                    <div className="text-align-justify align-items-start row" style={{ paddingBottom: 36 }}>
                        {juristList.map((eachData) => {
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
export default NotableJurist