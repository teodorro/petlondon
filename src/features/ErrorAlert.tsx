import { useEffect } from "react";
import { Alert, Box } from "@mui/material";
import { createSelectors } from "../utils/create-selectors";
import useErrorStore from "../stores/error-store";

export default function ErrorAlert() {
  const errors = createSelectors(useErrorStore);

  const errorHappened = errors.use.isErrorHappened();

  const setErrorHappened = useErrorStore((state) => state.setErrorHappened);

  useEffect(() => {
    if (errorHappened) {
      const timer = setTimeout(() => {
        setErrorHappened(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [errorHappened]);

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        marginBottom: "1em",
        maxWidth: "min(100%, 30rem)",
        zIndex: 10000,
        justifyContent: "center",
        display: errorHappened ? "block" : "none",
      }}
    >
      <Alert variant="filled" severity="error" sx={{ whiteSpace: "pre-line" }}>
        {errors.use.message()}
      </Alert>
    </Box>
  );
}
