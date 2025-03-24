import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config/index";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Switch,
  useTheme,
} from "@mui/material";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const endpoint = isSignup
      ? `${config.apiBaseUrl}${config.taskRoutes.signup}`
      : `${config.apiBaseUrl}${config.taskRoutes.login}`;

    const body = isSignup
      ? JSON.stringify({ username, email, password, passwordConfirm })
      : JSON.stringify({ email, password });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json();
    if (response.ok) {
      login(data.token);
      navigate(
        `${config.taskRoutes.getTasks}${config.taskRoutes.getUserTasks}`
      );
    } else {
      alert("Authentication failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${config.apiBaseUrl}/users/auth/google`;
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "0 16px",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 600 }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {isSignup && (
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isSignup && (
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          )}
          <Button type="submit" variant="contained" fullWidth>
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </Box>

        <Button
          variant="outlined"
          onClick={handleGoogleLogin}
          fullWidth
          sx={{
            mt: 2,
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.paper,
            },
          }}
        >
          Continue with Google
        </Button>

        <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Switch to {isSignup ? "Login" : "Sign Up"}
          </Typography>
          <Switch
            checked={isSignup}
            onChange={() => setIsSignup(!isSignup)}
            color="primary"
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
