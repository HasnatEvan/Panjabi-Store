import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

;

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading indicator if the authentication status is still being fetched
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    // If the user is authenticated, render the children (protected components)
    if (user) {
        return children;
    }

    // If not authenticated, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
