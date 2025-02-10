import { createTheme } from "@mui/material/styles";

// Define your refined pastel grey-burgundy color palette
const pastelColors = {
  grey: "#e0e0e0", // Light grey for background
  burgundy: "#9e2a2f", // Softer and slightly muted burgundy
  lightBurgundy: "#f1c6c6", // Light burgundy for soft accents
  darkGrey: "#333333", // Dark grey text for readability
  offWhite: "#fafafa", // Off-white for cards and sections
  veryLightGrey: "#f5f5f5", // Very light grey for the background
};

const theme = createTheme({
  palette: {
    mode: "light", // Light mode
    primary: {
      main: "#350326", // Deep burgundy for primary
    },
    secondary: {
      main: "#6d4c41", // Secondary brownish tone
    },
    background: {
      default: "#dcd8d8", // Light grey background for the page
      paper: "#fbf7f7", // Light off-white for paper elements like cards
    },
    text: {
      primary: pastelColors.darkGrey, // Dark grey for text
      secondary: pastelColors.grey, // Light grey for secondary text
    },
  },
  spacing: 8, // Base spacing for margins and padding
  typography: {
    h1: {
      color: pastelColors.burgundy,
      fontSize: "2.2rem", // Slightly bigger title
      fontWeight: 600,
    },
    h2: {
      color: pastelColors.burgundy,
      fontSize: "1.7rem", // Slightly bigger subtitle
      fontWeight: 600,
    },
    body1: {
      color: pastelColors.darkGrey,
      fontSize: "1.1rem", // Slightly larger body text for readability
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: pastelColors.offWhite,
          color: pastelColors.darkGrey,
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Softer shadow for depth
          padding: "16px", // Consistent padding inside cards
          marginBottom: "24px", // Increased space between cards
          width: "100%", // Ensures cards take up the full available width
          maxWidth: "600px", // Set a maximum width for cards
          margin: "0 auto", // Center the cards horizontally
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#030d35", // Button background color
          color: "white",
          "&:hover": {
            backgroundColor: pastelColors.lightBurgundy, // Lighter hover effect
          },
          borderRadius: "5px", // Rounded button edges
          padding: "10px 20px", // Add padding to buttons for better click area
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: pastelColors.darkGrey,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          color: pastelColors.burgundy,
          "&.Mui-checked": {
            color: pastelColors.lightBurgundy,
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          marginTop: "16px", // Space between grid items
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

export default theme;
