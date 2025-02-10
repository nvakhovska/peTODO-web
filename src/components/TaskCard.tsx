import {
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  Box,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SubtaskList from "./SubtaskList";

// Define the types for the functions passed as props
interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    status: "completed" | "pending" | "in-progress";
    priority: "high" | "medium" | "low";
    dueDate?: string;
    subtasks?: Array<{
      _id: string;
      title: string;
      status: "completed" | "pending" | "in-progress";
    }>;
  };
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
  return (
    <Card
      sx={{
        bgcolor: getOverdueColor(task.dueDate ?? "", task.priority ?? "low"),
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
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
            label={<Typography variant="h6">{task.title}</Typography>}
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
