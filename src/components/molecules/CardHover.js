import React from "react";

const CardHover = () => {

    return (
        <div className="containerCardHover" style={{ marginTop: 35, marginBottom: 35 }}>
            <div>
                <div className="contentCardHover">
                    <h2>Jane Doe</h2>
                    <span>UI & UX Designer</span>
                </div>
            </div>
            <div>
                <div className="contentCardHover">
                    <h2>Alex Smith</h2>
                    <span>CEO Expert</span>
                </div>
            </div>
            <div>
                <div className="contentCardHover">
                    <h2>Emily New</h2>
                    <span>Web Designer</span>
                </div>
            </div>
            <div>
                <div className="contentCardHover">
                    <h2>Lisa Boley</h2>
                    <span>Marketing Coordinator</span>
                </div>
            </div>
        </div>
    )
}

export default CardHover;