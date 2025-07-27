import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TaskList from "./components/TaskList";
import Navbar from "./components/Navbar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./theme";
import config from "./config/index";
import OAuthSuccess from "./pages/OAuthSuccess";
import { useThemeContext } from "./context/ThemeContext";
import SocketListener from "./components/SocketListener";

function App() {
  const { themeMode } = useThemeContext();
  const theme = getTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <TaskProvider>
            <SocketListener />
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate
                    to={
                      config.taskRoutes.getTasks +
                      config.taskRoutes.getUserTasks
                    }
                  />
                }
              />
              <Route path={config.taskRoutes.login} element={<AuthPage />} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route
                path={
                  config.taskRoutes.getTasks + config.taskRoutes.getUserTasks
                }
                element={
                  <>
                    <Navbar />
                    <ProtectedRoute>
                      <TaskList />
                    </ProtectedRoute>
                  </>
                }
              />
            </Routes>
          </TaskProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
