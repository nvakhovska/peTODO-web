import { useEffect } from "react";
import socket from "../utils/socket";
import { useTasksContext } from "../context/TaskContext";
import { Task } from "../types/Task";

const useSocket = () => {
  const { addTask, removeTask, updateTask } = useTasksContext();

  useEffect(() => {
    socket.on("taskCreated", (task: Task) => {
      addTask(task);
    });

    socket.on("taskDeleted", ({ id }) => {
      removeTask(id);
    });

    socket.on(
      "taskUpdated",
      ({ id, status }: { id: string; status: string }) => {
        updateTask(id, status);
      }
    );

    // Clean-up on unmount
    return () => {
      socket.off("taskCreated");
      socket.off("taskDeleted");
      socket.off("taskUpdated");
    };
  }, [addTask, removeTask, updateTask]);
};

export default useSocket;
