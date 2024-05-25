
import React, { useContext } from 'react';
import { DataContext } from './context/DataContext';
import { Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { CookieKeys } from './constant/CookieKeys';
import { isEmpty } from 'lodash';


const ProtectedRoute = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies([CookieKeys.LOGGEDINUSER]);

    return !isEmpty(cookies[CookieKeys.LOGGEDINUSER]) ? children : <Navigate to="/login" />;

}

export default ProtectedRoute;