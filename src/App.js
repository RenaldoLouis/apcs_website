import React from "react";
import "./App.css";
import {DataContextProvider} from "./context/DataContext";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PublicRoute from "./PublicRoute";
import Home from "./Pages/Home/Home";

const Main = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<PublicRoute />} />
    </Routes>
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
