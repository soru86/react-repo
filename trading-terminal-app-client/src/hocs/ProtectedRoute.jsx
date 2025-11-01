import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/context/AuthProvider";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, authData } = useAuth();
  const [isAuthenticated, setIsAuthneticated] = useState(false);

  useEffect(() => {
    // This effect can be used to refresh or check the auth data
    if (authData && authData instanceof Promise) {
      authData.then(data => {
        setIsAuthneticated(data?.authenticated);
      }).catch(error => {
        console.error("Error loading auth data:", error);
      });
    }
  }, [authData]);

  if (!user && !isAuthenticated) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
