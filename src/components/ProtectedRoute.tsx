import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";
import config from "../config/index";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to={config.taskRoutes.login} />;
};

export default ProtectedRoute;
