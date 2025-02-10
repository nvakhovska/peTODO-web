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
} from "@mui/material";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Added username state
  const [passwordConfirm, setPasswordConfirm] = useState(""); // Added passwordConfirm state
  const [isSignup, setIsSignup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Determine the endpoint and request body based on signup/login mode
    const endpoint = isSignup
      ? `${config.apiBaseUrl}${config.taskRoutes.signup}`
      : `${config.apiBaseUrl}${config.taskRoutes.login}`;

    const body = isSignup
      ? JSON.stringify({ username, email, password, passwordConfirm }) // Include username and passwordConfirm for signup
      : JSON.stringify({ email, password }); // Only email and password for login

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json();
    if (response.ok) {
      login(data.token);
      navigate(config.taskRoutes.getTasks + config.taskRoutes.getUserTasks);
    } else {
      alert("Authentication failed");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Ensures container takes up full height
        padding: "0 16px", // Adds horizontal padding
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px", // Limits the width for larger screens
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Centers form elements
        }}
      >
        <Typography variant="h5" gutterBottom>
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
              required={isSignup} // Only required for signup
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
              required={isSignup} // Only required for signup
            />
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </Box>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Switch to {isSignup ? "Login" : "Sign Up"}
          </Typography>
          <Switch checked={isSignup} onChange={() => setIsSignup(!isSignup)} />
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
