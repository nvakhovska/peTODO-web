import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { createTask } from "../api/taskApi";
import { CreateTask } from "../types/Task";
import { useAuth } from "../context/AuthContext";
import { fetchUserIdByEmailOrUsername } from "../api/userApi";

interface TaskCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const TaskCreateDialog: React.FC<TaskCreateDialogProps> = ({
  open,
  onClose,
  onTaskCreated,
}) => {
  const theme = useTheme();
  const { token, id: currentUserId } = useAuth();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [assignToAll, setAssignToAll] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [assignedUserId, setAssignedUserId] = useState<string | null>(null);

  const handleAssignedToChange = async (value: string) => {
    setAssignedTo(value);
    if (value) {
      try {
        const userId = await fetchUserIdByEmailOrUsername(value);
        setAssignedUserId(userId);
      } catch (error) {
        console.error("Error fetching userId", error);
        setAssignedUserId(null);
      }
    } else {
      setAssignedUserId(null);
    }
  };

  const handleCreateTask = async () => {
    if (!token) return;

    const assignedUsers = assignToAll ? [] : [assignedUserId || currentUserId];
    const validAssignedTo = assignedUsers.filter(Boolean) as string[];

    const newTask: CreateTask = {
      title,
      priority,
      status: "pending",
      assignedTo: validAssignedTo,
      dueDate: dueDate ? dueDate : undefined,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    };

    try {
      await createTask(newTask, token);
      onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          padding: 2,
        },
      }}
    >
      <DialogTitle sx={{ color: theme.palette.primary.main }}>
        Create New Task
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            label="Priority"
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={showOptionalFields}
              onChange={() => setShowOptionalFields((prev) => !prev)}
            />
          }
          label="Add more options"
        />

        {showOptionalFields && (
          <>
            <TextField
              label="Assigned to (Username or Email)"
              value={assignedTo}
              onChange={(e) => handleAssignedToChange(e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={assignToAll}
                  onChange={(e) => setAssignToAll(e.target.checked)}
                />
              }
              label="Assign to all users"
            />
            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              fullWidth
              margin="normal"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreateTask} variant="contained" color="primary">
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskCreateDialog;
