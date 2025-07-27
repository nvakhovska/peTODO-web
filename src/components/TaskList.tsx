import { useEffect, useState } from "react";
import { useTasksContext } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { Box, Fab, Grid, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchData } from "../utils/fetchData";
import { getOverdueColor } from "../utils/colorUtils";
import TaskCard from "./TaskCard";
import TaskFilters from "./TaskFilters";
import config from "../config/index";
import TaskCreateDialog from "./TaskCreateDialog";
import { Task } from "../types/Task";

type TaskGroups = {
  Overdue: Task[];
  Tomorrow: Task[];
  "Next Week": Task[];
  Later: Task[];
};

const TaskList = () => {
  const { tasks, setTasks } = useTasksContext();
  const { token } = useAuth();
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"priority" | "date">("priority");
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const response = await fetchData(
        token,
        "GET",
        undefined,
        config.taskRoutes.getUserTasks
      );
      const data = await response?.json();

      if (response?.ok && data?.data) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [token, setTasks]);

  const handleTaskCreated = async () => {
    await fetchTasks();
  };

  const updateTaskStatus = async (
    taskId: string,
    newStatus: "completed" | "pending" | "in-progress"
  ) => {
    try {
      if (!token) throw new Error("No token available");
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

  const getTaskGroup = (task: Task): keyof TaskGroups => {
    const now = new Date();
    const dueDate = task.dueDate ? new Date(task.dueDate) : new Date();
    if (!dueDate || isNaN(dueDate.getTime())) return "Later";
    if (dueDate < now) return "Overdue";

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    if (dueDate.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    if (dueDate <= nextWeek) return "Next Week";

    return "Later";
  };

  const sortedFilteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(filter.toLowerCase()))
    .filter(
      (task) => statusFilter.length === 0 || statusFilter.includes(task.status)
    )
    .sort((a, b) => {
      const now = new Date();
      const aDueDate = new Date(a.dueDate || 0);
      const bDueDate = new Date(b.dueDate || 0);
      const isOverdueA = aDueDate < now;
      const isOverdueB = bDueDate < now;

      if (isOverdueA && !isOverdueB) return -1;
      if (!isOverdueA && isOverdueB) return 1;

      const priorityOrder = { high: 1, medium: 2, low: 3 };
      if (a.priority !== b.priority) {
        return (
          (priorityOrder[a.priority ?? "low"] ?? 3) -
          (priorityOrder[b.priority ?? "low"] ?? 3)
        );
      }

      return aDueDate.getTime() - bDueDate.getTime();
    });

  const groupedTasks: TaskGroups = {
    Overdue: [],
    Tomorrow: [],
    "Next Week": [],
    Later: [],
  };

  sortedFilteredTasks.forEach((task) => {
    const group = getTaskGroup(task);
    groupedTasks[group].push(task);
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <TaskFilters
        filter={filter}
        setFilter={setFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {Object.keys(groupedTasks).map((group) => (
        <Box key={group} sx={{ marginBottom: theme.spacing(4) }}>
          <Typography
            variant="h6"
            sx={{
              color: "rgb(var(--clr-primary))",
              textAlign: "left",
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
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

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpenDialog(true)}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <TaskCreateDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onTaskCreated={handleTaskCreated}
      />
    </Box>
  );
};

export default TaskList;
