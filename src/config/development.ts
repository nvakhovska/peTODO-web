const config = {
  apiBaseUrl: import.meta.env.VITE_API_URL, // Development URL\
  taskRoutes: {
    getTasks: "/tasks",
    getUserTasks: "/task-for-user/",
    login: "/users/login",
    signup: "/users/signup",
  },
};

export default config;
