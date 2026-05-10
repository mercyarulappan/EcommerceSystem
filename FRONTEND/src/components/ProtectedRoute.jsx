import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const ProtectedRoute = ({ children, role }) => {
  const { user, userRole, isLoaded } = useContext(AuthContext);

  // CRITICAL: If we haven't finished checking the token, show nothing (or a spinner)
  // This stops the accidental redirect to /login
  if (!isLoaded) 
    return <div>Loading...</div>

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) return <Navigate to="/" replace />;

  return children;
};


export default ProtectedRoute;
