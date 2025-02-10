import { useEffect, useState } from "react";
import { useTasksContext } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { Box, Grid, Typography } from "@mui/material";
import { fetchData } from "../utils/fetchData";
import { getOverdueColor } from "../utils/colorUtils";
import TaskCard from "./TaskCard";
import TaskFilters from "./TaskFilters";
import config from "../config/index";

// Import the Task interface from your models
import { Task } from "../types/Task";

// Define the type for the grouped tasks
type TaskGroups = {
  Overdue: Task[];
  Tomorrow: Task[];
  "Next Week": Task[];
  Later: Task[];
};

const TaskList = () => {
  const { tasks, setTasks } = useTasksContext();
  const { token, id } = useAuth();
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"priority" | "date">("priority");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      try {
        const response = await fetchData(
          token,
          "GET",
          undefined,
          config.taskRoutes.getUserTasks + id
        );
        const data = await response?.json();
        if (response?.ok && data?.data) {
          setTasks(data.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [token, id, setTasks]);

  const updateTaskStatus = async (
    taskId: string,
    newStatus: "completed" | "pending" | "in-progress"
  ) => {
    try {
      if (!token) {
        throw new Error("No token available");
      }

      await fetchData(
        token,
        "PATCH",
        JSON.stringify({ status: newStatus }),
        `/${taskId}`
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskToggle = (
    taskId: string,
    newStatus: "completed" | "pending" | "in-progress"
  ) => {
    updateTaskStatus(taskId, newStatus);
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task._id === taskId) {
          const updatedSubtasks = task.subtasks?.map((subtask) => ({
            ...subtask,
            status: newStatus,
          }));
          return {
            ...task,
            status: newStatus,
            subtasks: updatedSubtasks,
          };
        }
        return task;
      })
    );
  };

  const handleSubtaskToggle = (
    taskId: string,
    subtaskId: string,
    newStatus: "completed" | "pending" | "in-progress"
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task._id === taskId) {
          const updatedSubtasks = task.subtasks?.map((subtask) =>
            subtask._id === subtaskId
              ? { ...subtask, status: newStatus }
              : subtask
          );
          const allCompleted = updatedSubtasks?.every(
            (subtask) => subtask.status === "completed"
          );
          return {
            ...task,
            subtasks: updatedSubtasks,
            status: allCompleted ? "completed" : task.status,
          };
        }
        return task;
      })
    );
  };

  // Helper function to determine the group by date
  const getTaskGroup = (task: Task) => {
    const now = new Date();
    const dueDate = new Date(
      task.dueDate ? new Date(task.dueDate) : new Date()
    );

    // Overdue task
    if (dueDate < now) {
      return "Overdue";
    }

    // Tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    if (dueDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    // Next Week
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    if (dueDate <= nextWeek) {
      return "Next Week";
    }

    // Other future tasks
    return "Later";
  };

  // Sort tasks by overdue first, then by priority and due date
  const sortedFilteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(filter.toLowerCase())) // Title filter
    .filter(
      (task) => statusFilter.length === 0 || statusFilter.includes(task.status)
    ) // Status filter
    .sort((a, b) => {
      const now = new Date();
      const aDueDate = new Date(a.dueDate || 0);
      const bDueDate = new Date(b.dueDate || 0);

      // Sort by overdue first, then by priority, then by due date
      const isOverdueA = aDueDate < now;
      const isOverdueB = bDueDate < now;

      if (isOverdueA && !isOverdueB) return -1;
      if (!isOverdueA && isOverdueB) return 1;

      // Sort by priority
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      if (a.priority !== b.priority) {
        return (
          (priorityOrder[a.priority as "high" | "medium" | "low"] || 3) -
          (priorityOrder[b.priority as "high" | "medium" | "low"] || 3)
        );
      }

      // If priorities are the same, sort by due date
      return aDueDate.getTime() - bDueDate.getTime();
    });

  // Group tasks by overdue, tomorrow, next week, and later
  const groupedTasks: TaskGroups = sortedFilteredTasks.reduce(
    (groups: TaskGroups, task) => {
      const group = getTaskGroup(task);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(task);
      return groups;
    },
    { Overdue: [], Tomorrow: [], "Next Week": [], Later: [] }
  );

  return (
    <Box sx={{ minHeight: "100vh", padding: 3 }}>
      <TaskFilters
        filter={filter}
        setFilter={setFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <Grid container spacing={3}>
        {/* Render each group */}
        {Object.keys(groupedTasks).map((group) => (
          <Box key={group} sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {group}
            </Typography>
            <Grid container spacing={3}>
              {groupedTasks[group as keyof TaskGroups].map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task._id}>
                  <TaskCard
                    task={{ ...task, priority: task.priority ?? "low" }}
                    getOverdueColor={getOverdueColor}
                    handleTaskToggle={handleTaskToggle}
                    handleSubtaskToggle={handleSubtaskToggle}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskList;
