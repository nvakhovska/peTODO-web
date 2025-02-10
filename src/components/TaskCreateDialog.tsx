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
} from "@mui/material";
import { createTask } from "../api/taskApi";
import { CreateTask, Task } from "../types/Task";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import { fetchUserIdByEmailOrUsername } from "../api/userApi"; // Assume you have a function to fetch userId

interface TaskCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void; // Callback to refresh the task list
}

const TaskCreateDialog: React.FC<TaskCreateDialogProps> = ({
  open,
  onClose,
  onTaskCreated,
}) => {
  const { token, id: currentUserId } = useAuth(); // Get current user ID using useAuth hook
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [assignedTo, setAssignedTo] = useState<string>(""); // For either username or UserEmail
  const [dueDate, setDueDate] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [assignToAll, setAssignToAll] = useState<boolean>(false);
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);
  const [assignedUserId, setAssignedUserId] = useState<string | null>(null); // Store userId here

  // Fetch the userId if assignedTo is a username or email
  const handleAssignedToChange = async (value: string) => {
    setAssignedTo(value);

    // Try to fetch userId by username or email
    if (value) {
      try {
        const userId = await fetchUserIdByEmailOrUsername(value); // Your API function
        setAssignedUserId(userId);
      } catch (error) {
        console.error("Error fetching userId", error);
        setAssignedUserId(null); // Reset if there was an error
      }
    } else {
      setAssignedUserId(null); // Reset if empty
    }
  };

  const handleCreateTask = async () => {
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    // Ensure assignedTo is an array of strings, filter out any null or invalid userIds
    const assignedUsers = assignToAll ? [] : [assignedUserId || currentUserId]; // Fallback to currentUserId if assignedUserId is null

    // Filter out any null values (if assignedUserId is null, it will be excluded)
    const validAssignedTo = assignedUsers.filter(
      (userId) => userId !== null
    ) as string[];

    const newTask: CreateTask = {
      title,
      priority,
      status: "pending",
      assignedTo: validAssignedTo, // Only valid userIds will be in assignedTo array
      dueDate,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [], // Convert tags to an array
    };

    try {
      const createdTask = await createTask(newTask, token); // Pass the token to the createTask function
      onTaskCreated(createdTask); // Update the task list after creation with the task containing _id
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Task</DialogTitle>
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
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        {/* Checkbox to toggle showing additional fields */}
        <FormControlLabel
          control={
            <Checkbox
              checked={showOptionalFields}
              onChange={() => setShowOptionalFields((prev) => !prev)}
            />
          }
          label="Add more options"
        />

        {/* Optional fields */}
        {showOptionalFields && (
          <>
            <TextField
              label="Assigned to (Username or UserEmail)"
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
              InputLabelProps={{
                shrink: true,
              }}
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
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreateTask} color="primary">
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskCreateDialog;
