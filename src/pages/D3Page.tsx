import ModeNumberLines from "../features/d3charts/ModeNumberLines";
import { Box } from "@mui/material";
import ModeDisruptionsLines from "../features/d3charts/ModeDisruptionsLines";

export default function D3Page() {
  const chartSx = {
    borderRadius: "0.5rem",
    overflow: "hidden",
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 1,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflowY: "auto",
        backgroundColor: "var(--theme-background-paper-color)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          p: 1,
          overflowY: "auto",
        }}
      >
        <Box sx={chartSx}>
          <ModeNumberLines></ModeNumberLines>
        </Box>
        <Box sx={{ py: "0.5rem" }}></Box>
        <Box sx={chartSx}>
          <ModeDisruptionsLines></ModeDisruptionsLines>
        </Box>
      </Box>
    </Box>
  );
}
