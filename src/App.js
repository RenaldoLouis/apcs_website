import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import i18next from "i18next";
import { useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import { I18nextProvider } from "react-i18next";
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import persona5 from "./assets/audios/p5.mp3";
import homeScreenImageGradient from "./assets/images/homeScreenImageGradient.jpg";
import homeScreenImageGradientMobile from "./assets/images/homeScreenImageGradientMobile.jpg";
import MainLayout from "./components/molecules/MainLayout";
import { PathName } from "./constant/PathName";
import { DataContextProvider, useAuth } from "./context/DataContext";
import About from "./Pages/About/About";
import Achievers from "./Pages/Achievers/Achievers";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import PaymentPage from "./Pages/AdminDashboard/PaymentPage";
import ContactUs from "./Pages/ContactUs/ContactUs";
import GaleryPage from "./Pages/Galery/GaleryPage";
import Home from "./Pages/Home/Home";
import JuryDashboard from './Pages/JuryDashboard/JuryDashboard';
import LandingPage from "./Pages/Landing/LandingPage";
import Login from "./Pages/Login/Login";
import Podcast from "./Pages/Podcast/Podcast";
import Register from "./Pages/Register/Register";
import ScannerPage from './Pages/Scanner/ScannerPage';
import BookingCompletePage from './Pages/SelectSeat/BookingCompletePage';
import SelectSeatPage from './Pages/SelectSeat/SelectSeatPage';
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const audio = new Audio(persona5);

function ImagePreloader({ src, onLoad }) {
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = onLoad;
  }, [src, onLoad]);

  return null;
}

const Main = () => {
  const { setImageHomeLoaded, isMobileAndSmaller } = useAuth();
  const handleImageLoad = () => {
    setImageHomeLoaded(true);
  };

  return (
    <AnimatePresence mode='wait'>
      <ImagePreloader src={isMobileAndSmaller ? homeScreenImageGradientMobile : homeScreenImageGradient} onLoad={handleImageLoad} />

      <Routes>
        <Route path="/" element={<LandingPage audio={audio} />} />
        {/* <Route path="/home" element={<Transition children={<MainLayout children={<Home homeImagehero={isMobileAndSmaller ? homeScreenImageGradientMobile : homeScreenImageGradient} />} />} />} /> */}
        <Route path={PathName.home} element={<MainLayout children={<Home homeImagehero={isMobileAndSmaller ? homeScreenImageGradientMobile : homeScreenImageGradient} />} />} />
        <Route path={PathName.about} element={<MainLayout children={<About />} />} />
        <Route path={PathName.gallery} element={<MainLayout children={<GaleryPage />} />} />
        <Route path={PathName.achievers} element={<MainLayout children={<Achievers />} />} />
        <Route path={PathName.podcast} element={<MainLayout children={<Podcast />} />} />
        <Route path={PathName.contactUs} element={<MainLayout children={<ContactUs />} />} />
        <Route path={PathName.register} element={<MainLayout children={<Register />} hidden={true} />} />
        {/* <Route path={"/payment"} element={<MainLayout children={<Payment />} />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/adminDashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/select-seat" element={
          <SelectSeatPage />
        } />
        <Route path="/booking-complete" element={
          <BookingCompletePage />
        } />
        <Route path="/juryComment" element={
          <JuryDashboard />
        } />
        <Route path="/scan" element={
          <ProtectedRoute>
            <ScannerPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<PublicRoute />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {

  let theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          outlined: {
            borderRadius: '50px',
            color: 'white',
            borderColor: 'white',
            fontSize: {
              xs: '2vmin',
              sm: '2vmin',
              md: '1rem',
              lg: '1.1rem'
            },
            padding: {
              xs: '6px 16px',
              sm: '8px 20px',
              md: '10px 24px',
              lg: '12px 28px'
            },
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          },
        },
      },
    },
  });
  // theme = responsiveFontSizes(theme);

  return (
    <Router>
      <DataContextProvider>
        <ToastContainer
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          position="bottom-left"
        />
        <ThemeProvider theme={theme}>
          <CookiesProvider>
            <I18nextProvider i18n={i18next}>
              <Main />
            </I18nextProvider>
          </CookiesProvider>
        </ThemeProvider>
      </DataContextProvider>
    </Router>
  );
}

export default App;
