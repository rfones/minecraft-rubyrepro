import React, { useEffect } from "react";

import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const SnackbarContext = React.createContext();

export function SnackbarProvider({ children }) {
  const addSnackbar = options => {
    queueRef.current.push({ ...options, key: new Date().getTime() });
    if (open) {
      setOpen(false);
    } else {
      processQueue();
    }
  };

  const [state] = React.useState({
    add: addSnackbar
  });

  const queueRef = React.useRef([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  useEffect(() => {
    processQueue();
  }, [queueRef]);

  const processQueue = () => {
    if (queueRef.current.length > 0) {
      setMessageInfo(queueRef.current.shift());
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    processQueue();
  };

  const classes = useStyles();

  const getClass = () => {
    if (
      messageInfo.severity &&
      messageInfo.severity.toLowerCase() === "error"
    ) {
      return classes.error;
    }

    if (
      messageInfo.severity &&
      messageInfo.severity.toLowerCase() === "warning"
    ) {
      return classes.warning;
    }

    return null;
  };

  return (
    <SnackbarContext.Provider value={state}>
      {messageInfo && (
        <Snackbar
          key={messageInfo ? messageInfo.key : undefined}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          onExited={handleExited}
          message={messageInfo ? messageInfo.message : undefined}
          className={getClass()}
          action={
            <>
              {messageInfo.undoAction && (
                <Button
                  color="secondary"
                  size="small"
                  onClick={messageInfo.undoAction}
                >
                  UNDO
                </Button>
              )}
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>
            </>
          }
        />
      )}
      {children}
    </SnackbarContext.Provider>
  );
}

const useStyles = makeStyles(theme => ({
  error: {
    "& .MuiSnackbarContent-root": {
      backgroundColor: "#b30000"
    }
  },
  warning: {
    "& .MuiSnackbarContent-root": {
      backgroundColor: "#fc0",
      color: "#000"
    }
  }
}));

export function useSnackbar() {
  const context = React.useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}
