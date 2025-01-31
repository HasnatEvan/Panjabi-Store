import { Navigate } from "react-router-dom";
import useRole from "../Hooks/useRole";

const SellerRoute = ({ children }) => {
    const [role, isLoading] = useRole();

    if (isLoading) {
        return <span className="loading loading-bars loading-lg"></span>;
    }

    return role === "seller" ? children : <Navigate to="/dashboard/myOrders" replace />;
};

export default SellerRoute;
