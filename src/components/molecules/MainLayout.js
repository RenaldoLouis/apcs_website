import { motion } from "framer-motion";
import Navbar from "../atom/navbar";
import Footer from "./Footer";

const MainLayout = (props) => {
    const { children } = props
    return (
        <div>
            <Navbar />
            <section>
                {children}
            </section>
            <Footer />
        </div>
    )
}

export default MainLayout;
