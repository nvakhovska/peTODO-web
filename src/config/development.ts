const config = {
  apiBaseUrl: "http://localhost:3000/api/v1", // Development URL\
  taskRoutes: {
    getTasks: "/tasks",
    getUserTasks: "/task-for-user",
    login: "/users/login",
    signup: "/users/signup",
  },
};

export default config;
