import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = () => {
    return <Navigate to={"/home"} />;
}

export default PublicRoute;