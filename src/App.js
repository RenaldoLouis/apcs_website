import React from "react";
import "./App.css";
import { DataContextProvider } from "./context/DataContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import PublicRoute from "./PublicRoute";
import Home from "./Pages/Home/Home";
import LandingPage from "./Pages/Landing/LandingPage";
import persona5 from "./assets/audios/p5.mp3"
import { AnimatePresence } from 'framer-motion';
import Transition from "./components/atom/Transition";
import Achievers from "./Pages/Achievers/Achievers";
import About from "./Pages/About/About";
import Podcast from "./Pages/Podcast/Podcast";
import MainLayout from "./components/molecules/MainLayout";
import GaleryPage from "./Pages/Galery/GaleryPage";
import Login from "./Pages/Login/Login";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import { CookiesProvider } from "react-cookie";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { PathName } from "./constant/PathName";


const audio = new Audio(persona5);
const Main = () => {
  return (
    <AnimatePresence mode='wait'>
      <Routes>
        <Route path="/" element={<LandingPage audio={audio} />} />
        {/* <Route path="/home" element={<Transition children={<MainLayout children={<Home audio={audio} />} />} />} /> */}
        <Route path={PathName.home} element={<MainLayout children={<Home audio={audio} />} />} />
        <Route path={PathName.about} element={<MainLayout children={<About />} />} />
        <Route path={PathName.gallery} element={<MainLayout children={<GaleryPage />} />} />
        <Route path={PathName.achievers} element={<MainLayout children={<Achievers />} />} />
        <Route path={PathName.podcast} element={<MainLayout children={<Podcast />} />} />
        <Route path={PathName.contactUs} element={<MainLayout children={<Podcast />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminDashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<PublicRoute />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
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
        <CookiesProvider>
          <I18nextProvider i18n={i18next}>
            <Main />
          </I18nextProvider>
        </CookiesProvider>
      </DataContextProvider>
    </Router>
  );
}

export default App;
