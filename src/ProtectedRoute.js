
import React, { useContext } from 'react';
import { DataContext, useAuth } from './context/DataContext';
import { Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { CookieKeys } from './constant/CookieKeys';
import { isEmpty } from 'lodash';


const ProtectedRoute = ({ children }) => {
    // const [cookies, setCookie, removeCookie] = useCookies([CookieKeys.LOGGEDINUSER]);
    const { user } = useAuth()

    return !isEmpty(user) ? children : <Navigate to="/login" />;

}

export default ProtectedRoute;