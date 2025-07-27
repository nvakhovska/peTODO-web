const config = {
  apiBaseUrl: `${import.meta.env.VITE_API_URL}/api/v1`, // Production URL
  taskRoutes: {
    getTasks: "/tasks",
    getUserTasks: "/task-for-user",
    login: "/users/login",
    signup: "/users/signup",
  },
};

export default config;
