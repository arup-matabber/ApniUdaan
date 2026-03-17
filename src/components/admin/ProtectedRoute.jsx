import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

const ProtectedRoute = ({children}) => {
    const {user} = useSelector(store=>store.auth);

    // Check if user is authenticated and has proper role
    if (user === null || (user.role !== 'admin' && user.role !== 'recruiter')) {
        return <Navigate to="/" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;
