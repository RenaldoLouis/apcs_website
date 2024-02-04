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


const audio = new Audio(persona5);
const Main = () => {
  return (
    <AnimatePresence mode='wait'>
      <Routes>
        <Route path="/" element={<LandingPage audio={audio} />} />
        <Route path="/home" element={<Transition children={<Home audio={audio} />} />} />
        <Route path="*" element={<PublicRoute />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div>
      <DataContextProvider>
        <Router>
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
          <Main />
        </Router>
      </DataContextProvider>
    </div>
  );
}

export default App;
