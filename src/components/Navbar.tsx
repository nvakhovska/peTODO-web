import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../config/index";
import { useThemeContext } from "../context/ThemeContext";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useThemeContext();

  return (
    <AppBar position="static" sx={{ width: "100%" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {themeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>{" "}
          {/* Add gap between buttons */}
          <Button
            color="inherit"
            onClick={() => navigate(config.taskRoutes.getTasks)}
          >
            Tasks
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
