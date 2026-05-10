import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, isLoaded } = useContext(AuthContext);

  if (!isLoaded) return <div>Loading...</div>;

  // If user is logged in, redirect them to home
  if (user) return <Navigate to="/" replace />;

  // Otherwise allow access
  return children;
};

export default PublicRoute;
