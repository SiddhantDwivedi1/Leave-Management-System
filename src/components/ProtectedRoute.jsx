import { Navigate } from "react-router-dom";

/**
 * Protects routes from unauthenticated access
 * @param {ReactNode} children - Child components to render
 * @param {string} requiredRole - Optional role check (admin/employee)
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) return <Navigate to="/" />;

    // Role mismatch -> redirect to correct home
    if (requiredRole && user.role !== requiredRole) {
        return user.role === "admin"
            ? <Navigate to="/admin" />
            : <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;