import {
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Switch,
  useTheme,
} from "@mui/material";

interface Subtask {
  _id: string;
  title: string;
  status: "completed" | "pending" | "in-progress";
}

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
  handleSubtaskToggle: (
    taskId: string,
    subtaskId: string,
    newStatus: "completed" | "pending" | "in-progress"
  ) => void;
}

const SubtaskList = ({
  taskId,
  subtasks,
  handleSubtaskToggle,
}: SubtaskListProps) => {
  const theme = useTheme();

  return (
    <List>
      {subtasks.map((subtask) => (
        <ListItem
          key={subtask._id}
          sx={{
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            mb: 1,
            boxShadow:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05) 0px 1px 4px"
                : "rgba(0, 0, 0, 0.1) 0px 1px 4px",
            px: 2,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={subtask.status === "completed"}
                onChange={(e) =>
                  handleSubtaskToggle(
                    taskId,
                    subtask._id,
                    e.target.checked ? "completed" : "pending"
                  )
                }
              />
            }
            label={<ListItemText primary={subtask.title} />}
            sx={{ flex: 1 }}
          />
          <Switch
            checked={subtask.status === "in-progress"}
            onChange={(e) =>
              handleSubtaskToggle(
                taskId,
                subtask._id,
                e.target.checked ? "in-progress" : "pending"
              )
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default SubtaskList;
