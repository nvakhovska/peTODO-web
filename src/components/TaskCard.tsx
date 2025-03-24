import {
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  Box,
  Switch,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SubtaskList from "./SubtaskList";
import { Task } from "../types/Task";

interface TaskCardProps {
  task: Task;
  getOverdueColor: (
    dueDate: string,
    priority: "high" | "medium" | "low"
  ) => string;
  handleTaskToggle: (
    taskId: string,
    newStatus: "completed" | "pending" | "in-progress"
  ) => void;
  handleSubtaskToggle: (
    taskId: string,
    subtaskId: string,
    newStatus: "completed" | "pending" | "in-progress"
  ) => void;
}

const TaskCard = ({
  task,
  getOverdueColor,
  handleTaskToggle,
  handleSubtaskToggle,
}: TaskCardProps) => {
  const theme = useTheme();
  const overdueColor = getOverdueColor(
    task.dueDate ?? "",
    task.priority ?? "low"
  );

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: "10px",
        boxShadow:
          theme.palette.mode === "light"
            ? "rgba(176, 148, 88, 0.2) 0 7px 29px 0"
            : "rgba(176, 148, 88, 0.25) 5px 5px 15px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
        borderLeft: `6px solid ${overdueColor || theme.palette.primary.main}`,
        padding: 2,
        mb: 3,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={task.status === "completed"}
                onChange={(e) =>
                  handleTaskToggle(
                    task._id,
                    e.target.checked ? "completed" : "pending"
                  )
                }
              />
            }
            label={
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {task.title}
              </Typography>
            }
          />

          <Switch
            checked={task.status === "in-progress"}
            onChange={(e) =>
              handleTaskToggle(
                task._id,
                e.target.checked ? "in-progress" : "pending"
              )
            }
          />

          <Typography variant="body2" color="text.secondary">
            {task.dueDate
              ? new Date(task.dueDate).toDateString()
              : "No Due Date"}
          </Typography>

          <IconButton>
            <EditIcon />
          </IconButton>
        </Box>

        {task.subtasks && task.subtasks.length > 0 && (
          <SubtaskList
            taskId={task._id}
            subtasks={task.subtasks}
            handleSubtaskToggle={handleSubtaskToggle}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
