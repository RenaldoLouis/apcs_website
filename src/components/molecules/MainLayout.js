import Navbar from "../atom/navbar";
import Footer from "./Footer";

const MainLayout = (props) => {
    const { children } = props
    return (
        <>
            <Navbar />
            <section>
                {children}
            </section>
            <Footer />
        </>
    )
}

export default MainLayout;
