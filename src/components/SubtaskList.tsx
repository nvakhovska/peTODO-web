import {
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Switch,
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
  return (
    <List>
      {subtasks.map((subtask) => (
        <ListItem
          key={subtask._id}
          sx={{
            borderRadius: 2,
            bgcolor: "background.paper",
            mb: 1,
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
