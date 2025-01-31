import { Navigate } from "react-router-dom";
import useRole from "../Hooks/useRole";

const AdminRoute = ({ children }) => {
    const [role, isLoading] = useRole();

    if (isLoading) {
        return <span className="loading loading-bars loading-lg"></span>;
    }

    return role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
