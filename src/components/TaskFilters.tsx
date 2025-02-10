import {
  TextField,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

// Define the types for the props
interface TaskFiltersProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string[];
  setStatusFilter: React.Dispatch<React.SetStateAction<string[]>>;
  sortBy: "priority" | "date";
  setSortBy: React.Dispatch<React.SetStateAction<"priority" | "date">>;
}

const TaskFilters = ({
  filter,
  setFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}: TaskFiltersProps) => {
  const [open, setOpen] = useState(false); // Dialog open state
  const [localFilter, setLocalFilter] = useState(filter); // Local state for filter input
  const [localStatusFilter, setLocalStatusFilter] = useState(statusFilter); // Local state for status checkboxes

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setLocalStatusFilter((prev) => [...prev, value]);
    } else {
      setLocalStatusFilter((prev) => prev.filter((status) => status !== value));
    }
  };

  const handleApplyFilters = () => {
    setFilter(localFilter); // Apply title filter
    setStatusFilter(localStatusFilter); // Apply status filter
    setOpen(false); // Close dialog
  };

  const handleClearFilters = () => {
    setFilter(""); // Clear title filter
    setStatusFilter([]); // Clear status filter
    setOpen(false); // Close dialog
  };

  return (
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Filter
      </Button>

      {/* Dialog for filters */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm" // Set max width to 'sm' (small size)
        fullWidth // Ensure dialog takes up full width available
      >
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          {/* Filter by title */}
          <TextField
            label="Filter by Title"
            variant="outlined"
            fullWidth
            value={localFilter}
            onChange={(e) => setLocalFilter(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Filter by status */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ mb: 1 }}>Filter by Status:</Box>
            {["pending", "in-progress", "completed"].map((status) => (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    checked={localStatusFilter.includes(status)}
                    onChange={handleStatusChange}
                    value={status}
                  />
                }
                label={status.charAt(0).toUpperCase() + status.slice(1)}
              />
            ))}
          </Box>

          {/* Sort by options */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "priority" | "date")}
              label="Sort By"
            >
              <MenuItem value="priority">Sort by Priority</MenuItem>
              <MenuItem value="date">Sort by Due Date</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters}>Clear</Button>
          <Button onClick={handleApplyFilters}>Apply</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskFilters;
