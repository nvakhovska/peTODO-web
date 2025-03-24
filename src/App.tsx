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
import theme from "./theme";
import config from "./config/index";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
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
          </ThemeProvider>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
