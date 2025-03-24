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
  useTheme,
} from "@mui/material";
import { useState } from "react";

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
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState(filter);
  const [localStatusFilter, setLocalStatusFilter] = useState(statusFilter);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setLocalStatusFilter((prev) =>
      checked ? [...prev, value] : prev.filter((status) => status !== value)
    );
  };

  const handleApplyFilters = () => {
    setFilter(localFilter);
    setStatusFilter(localStatusFilter);
    setOpen(false);
  };

  const handleClearFilters = () => {
    setFilter("");
    setStatusFilter([]);
    setOpen(false);
  };

  return (
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        Filter
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            padding: 2,
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle sx={{ color: theme.palette.primary.main }}>
          Filters
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Filter by Title"
            variant="outlined"
            fullWidth
            value={localFilter}
            onChange={(e) => setLocalFilter(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Box sx={{ mb: 1, fontWeight: "bold" }}>Filter by Status:</Box>
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
          <Button onClick={handleClearFilters} color="secondary">
            Clear
          </Button>
          <Button
            onClick={handleApplyFilters}
            color="primary"
            variant="contained"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskFilters;
