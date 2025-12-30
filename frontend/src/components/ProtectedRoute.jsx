import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({ adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;
    if (!user) return <Navigate to={"/"} replace />;

    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />; // next()
};

export default ProtectedRoute;
