import React from "react";
import ArrowUp from "../../assets/icons/ArrowUp.png"

const Footer = () => {

    const handleClickScrollToTop = ()=>{
        window.scrollTo(0,0);
    }

    return (
        <footer className="footer">
            <div class="container">
                <img className="cursorPointer" src={ArrowUp} style={{ width: 54, height: 54 }} alt="ArrowUp" onClick={handleClickScrollToTop}/>

                <div class="row">
                    <div class="col">
                        <div>
                            Lorem Ipsum Dolor
                        </div>
                        <div>
                            Lorem Ipsum Dolor
                        </div>
                        <div>
                            Lorem ipsum dolor  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt  ut labore et dolore magna aliqua
                        </div>
                    </div>
                    <div class="col">
                        Column
                    </div>
                    <div class="col" />
                    <div class="col">
                        Column
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;