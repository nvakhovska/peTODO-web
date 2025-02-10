import axios from "axios";
import { Task } from "../types/Task";
import { useAuth } from "../context/AuthContext";
import config from "../config/index";

const API_URL = `${config.apiBaseUrl}/tasks/`;

export const fetchTasks = async (): Promise<Task[]> => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { token } = useAuth();
  if (!token) {
    throw new Error("User is not authenticated.");
  }

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Include token for authentication
    },
  });

  return response.data;
};

export const updateTask = async (
  taskId: string,
  updatedTask: Partial<Task>
) => {
  await axios.patch(`${API_URL}${taskId}`, updatedTask);
};

export const createTask = async (task: Task) => {
  await axios.post(API_URL, task);
};

export const deleteTask = async (taskId: string) => {
  await axios.delete(`${API_URL}${taskId}`);
};
