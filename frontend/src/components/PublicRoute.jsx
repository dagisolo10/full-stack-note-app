import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    if (user) return <Navigate to="/home" replace />;

    return <Outlet />;
};

export default PublicRoute;
