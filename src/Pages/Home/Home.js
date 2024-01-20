import React from "react";
import Navbar from "../../components/atom/navbar";
import Content from "./Content";

const Home = () => {
    return (
        <div>
            <Navbar />
            <Content />
            <div className="footer">
                <p>Footer</p>
            </div>
        </div>
    )
}

export default Home;