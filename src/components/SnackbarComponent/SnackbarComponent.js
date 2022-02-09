import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const SnackbarComponent = ({ open, status, message, funClose }) => {
  const Alert = React.forwardRef((props, ref) => {
    return (
      <MuiAlert
        elevation={6}
        ref={ref}
        variant="filled"
        {...props}
      />
    );
  });
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={5000}
      onClose={funClose}
    >
      <Alert
        onClose={funClose}
        severity={status}
        className="alert-style"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
