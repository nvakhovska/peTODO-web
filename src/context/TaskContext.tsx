import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "../types/Task";

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
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
