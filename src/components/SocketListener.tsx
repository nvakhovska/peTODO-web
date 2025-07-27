import { useEffect } from "react";
import socket from "../utils/socket";
import { useTasksContext } from "../context/TaskContext";
import { Task } from "../types/Task";

const SocketListener = () => {
  const { setTasks } = useTasksContext();

  useEffect(() => {
    socket.on("taskCreated", (newTask: Task) => {
      const highlightedTask = { ...newTask, highlighted: true };
      setTasks((prev) => [...prev, highlightedTask]);
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === newTask._id ? { ...t, highlighted: false } : t
          )
        );
      }, 3000);
    });

    socket.on(
      "taskUpdated",
      ({
        id,
        status,
      }: {
        id: string;
        status: "pending" | "in-progress" | "completed";
      }) => {
        setTasks((prev) =>
          prev.map((task) => {
            const taskId = task._id?.toString?.();
            return taskId === id?.toString?.()
              ? { ...task, status, highlighted: true }
              : task;
          })
        );
        setTimeout(() => {
          setTasks((prev) =>
            prev.map((t) =>
              t._id?.toString?.() === id?.toString?.()
                ? { ...t, highlighted: false }
                : t
            )
          );
        }, 3000);
      }
    );

    socket.on("taskDeleted", (deletedTaskId: string) => {
      setTasks((prev) =>
        prev.filter((t) => t._id.toString() !== deletedTaskId.toString())
      );
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [setTasks]);

  return null;
};

export default SocketListener;
