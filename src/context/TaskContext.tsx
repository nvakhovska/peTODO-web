import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Task } from "../types/Task";

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, status: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task._id !== id));
  }, []);

  const updateTask = useCallback((id: string, status: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === id ? ({ ...task, status } as Task) : task
      )
    );
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, addTask, removeTask, updateTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasksContext = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTasksContext must be used within TaskProvider");
  return context;
};
