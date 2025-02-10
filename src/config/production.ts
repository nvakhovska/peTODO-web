const config = {
  apiBaseUrl: "https://production-server-url.com/api/v1", // Production URL
  taskRoutes: {
    getTasks: "/tasks",
    getUserTasks: "/tasks/task-for-user",
    login: "/users/login",
    signup: "/users/signup",
  },
};

export default config;
