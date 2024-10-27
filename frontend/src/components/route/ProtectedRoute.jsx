import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { userInfo, loading } = useSelector((state) => state.auth);

  // Assuming userInfo is defined when authenticated
  const isAuthenticated = !!userInfo;
  const userRole = userInfo?.role; // Adjust based on your user info structure

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated and has the required role
  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
