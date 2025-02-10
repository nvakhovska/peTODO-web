export const getOverdueColor = (
  dueDate: string,
  priority: "high" | "medium" | "low"
) => {
  const currentDate = new Date();
  const due = new Date(dueDate);
  const overdueDays =
    1 +
    Math.floor((currentDate.getTime() - due.getTime()) / (1000 * 3600 * 24));
  console.log(overdueDays);
  if (overdueDays < 0) return ""; // No overdue color if the task is not overdue

  let baseColor: string;
  const saturation = Math.min(overdueDays * 10, 100); // Saturation increases with overdue days
  const lightness = Math.max(100 - overdueDays * 10, 50); // Lighter for fewer days overdue

  // Adjust base color based on priority
  switch (priority) {
    case "high":
      baseColor = "burgundy"; // Adjust for high priority
      break;
    case "medium":
      baseColor = "orange"; // Adjust for medium priority
      break;
    case "low":
      baseColor = "yellow"; // Adjust for low priority
      break;
    default:
      return "";
  }

  // Generate HSL color format (hue, saturation%, lightness%) for smoother color transitions
  let hue = 0;
  if (baseColor === "burgundy") {
    hue = 0; // Burgundy (red)
  } else if (baseColor === "orange") {
    hue = 30; // Orange
  } else if (baseColor === "yellow") {
    hue = 60; // Yellow
  }

  // Create an HSL color string where saturation and lightness change based on overdueDays
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
