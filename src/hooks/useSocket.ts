import { useEffect } from "react";
import socket from "../utils/socket";
import { useTasksContext } from "../context/TaskContext";

const useSocket = () => {
  const { addTask, removeTask, updateTaskStatus } = useTasksContext();

  useEffect(() => {
    socket.on("taskCreated", (task) => {
      addTask(task);
    });

    socket.on("taskDeleted", ({ id }) => {
      removeTask(id);
    });

    socket.on("taskStatusUpdated", ({ id, status }) => {
      updateTaskStatus(id, status);
    });

    // Clean-up on unmount
    return () => {
      socket.off("taskCreated");
      socket.off("taskDeleted");
      socket.off("taskStatusUpdated");
    };
  }, [addTask, removeTask, updateTaskStatus]);
};

export default useSocket;
