export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  createdBy?: string;
  assignedTo?: string[];
  subtasks?: Subtask[];
  highlighted?: boolean;
}

export interface Subtask {
  _id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
}

export interface CreateTask {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in-progress" | "completed"; // Default value is "pending" on backend
  assignedTo: string[]; // Array of User IDs
  subtasks?: CreateSubtask[];
  tags?: string[];
  comments?: Comment[];
}

export interface CreateSubtask {
  title: string;
  status: "pending" | "in-progress" | "completed";
}
