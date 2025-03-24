import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";

const OAuthSuccess = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.location.pathname.includes("/oauth-success")) return;

    const fullUrl = window.location.href;

    const url = new URL(fullUrl);
    const token = url.searchParams.get("token");

    if (token) {
      login(token);
      navigate("/tasks/task-for-user", { replace: true });
    } else {
      navigate("/users/login", { replace: true });
    }
  }, [login, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
      <Typography mt={2}>Finishing login...</Typography>
    </Box>
  );
};

export default OAuthSuccess;
