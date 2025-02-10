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
}

export interface Subtask {
  _id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
}
