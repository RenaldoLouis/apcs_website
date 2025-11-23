
import { isEmpty } from 'lodash';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/DataContext';


const ProtectedRoute = ({ children }) => {
    const { loggedInUser } = useAuth()

    return !isEmpty(loggedInUser) ? children : <Navigate to="/login" />;

}

export default ProtectedRoute;