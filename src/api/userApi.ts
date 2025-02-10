import config from "../config/index";

export const fetchUserIdByEmailOrUsername = async (usernameOrEmail: string) => {
  try {
    const response = await fetch(
      `${config.apiBaseUrl}/users/by-username-or-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail }),
      }
    );

    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();
    return data.userId; // Assuming the API returns the userId
  } catch (error) {
    console.error("Error fetching userId", error);
    throw new Error("Error fetching userId");
  }
};
