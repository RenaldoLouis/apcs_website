
import React, { useContext } from 'react';
import { DataContext } from './context/DataContext';
import { Route, Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
    const { loggedInAdmin, setLoggedInAdmin } = useContext(DataContext);

    return loggedInAdmin ? children : <Navigate to="/login" />;

}

export default ProtectedRoute;