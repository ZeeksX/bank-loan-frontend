import React from "react";
import { Snackbar, Alert } from "@mui/material";

const Toast = ({ message, type, onClose }) => {
    return (
        <Snackbar
            open={!!message}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert
                onClose={onClose}
                severity={type}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Toast;