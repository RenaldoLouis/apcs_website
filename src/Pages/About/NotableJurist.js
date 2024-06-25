import React from "react";
import HeaderTitle from "../../components/atom/HeaderTitle";
import jurist0 from "../../assets/images/jurists/jurist0.png"
import jurist1 from "../../assets/images/jurists/jurist1.png"
import jurist2 from "../../assets/images/jurists/jurist2.png"
import jurist3 from "../../assets/images/jurists/jurist3.png"
import jurist4 from "../../assets/images/jurists/jurist4.png"
import jurist5 from "../../assets/images/jurists/jurist5.png"
import jurist6 from "../../assets/images/jurists/jurist6.png"
import jurist7 from "../../assets/images/jurists/jurist7.png"
import jurist8 from "../../assets/images/jurists/jurist8.png"
import jurist9 from "../../assets/images/jurists/jurist9.png"

const NotableJurist = () => {

    const juristList = [
        {
            image: jurist1,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist2,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist3,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist4,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist5,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist6,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist7,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist8,
            name: "CHRISTINE UTOMO",
            title: "Jurist 2023",
            quote: "“Untuk kegiatan APCS, saya lihat banyak ada temanya, ada christmas, lagu-lagu populer dan bukan hanya musik klasik, karena musik banyak genrenya bukan hanya musik klasik dari Mozart, Bach, Beethoven. Tapi ada juga banyak banyak musik dari musikal atau lagu populer lainnya yang kita sering dengar,, Jadi ini merupakan kegiatan musik yang sangat-sangat kreatif yang bisa menarik generasi muda ini.”"
        },
        {
            image: jurist9,
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
                            FIRDY SALIM
                        </div>
                        <div className="text-align-justify" style={{ fontSize: 20 }}>
                            Head of Jourist
                        </div>

                        <div className="text-align-justify mangolaineFont" style={{ fontSize: 40, marginTop: 60 }}>
                            "Join us at the music festival to showcase your talent, connect with others, and make lasting memories."
                        </div>
                    </div>
                    <div className="col" style={{ color: "white" }}>
                        <img loading="lazy" src={jurist0} style={{ width: "100%", height: "100%" }} alt="" />
                    </div>
                </div>
                <div style={{ color: "white" }}>
                    <div className="text-align-justify align-items-start row g-5" style={{}}>
                        {juristList.map((eachData) => {
                            return (
                                <div className="col-12 col-md-4" style={{ marginBottom: 60 }}>
                                    <div className="jurist-image-container">
                                        <img loading="lazy" src={eachData.image} alt={eachData.name} className="jurist-image" />
                                    </div>
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