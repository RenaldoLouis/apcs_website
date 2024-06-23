
import React from 'react';
import { useAuth } from './context/DataContext';
import { Navigate } from 'react-router-dom';
import { isEmpty } from 'lodash';


const ProtectedRoute = ({ children }) => {
    const { user } = useAuth()

    return !isEmpty(user) ? children : <Navigate to="/login" />;

}

export default ProtectedRoute;