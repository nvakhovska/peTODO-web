import config from "../config/index";

export const fetchData = async (
  token: string,
  method: string,
  body?: string,
  route?: string
) => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (method !== "GET" && body) {
    options.body = body;
  }

  // Check if the route is valid (not null or undefined)
  if (!route) {
    console.error("Invalid route provided");
    return;
  }

  // Proceed with fetch if the route is valid
  const fullRoute = route.startsWith("/")
    ? `${config.apiBaseUrl}${config.taskRoutes.getTasks}${route}`
    : `${config.apiBaseUrl}${config.taskRoutes.getTasks}/${route}`;

  const response = await fetch(fullRoute, options);

  return response;
};
