import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { useSnackbar } from "../context/Snackbar";
import { useUser } from "../context/User";

export default function LinkMinecraft({ open, handleClose }) {
  const [model, setModel] = useState({
    name: ""
  });
  const [error, setError] = useState("");
  const snackbar = useSnackbar();

  const user = useUser();

  const handleChange = name => event => {
    const value = event.target.value;
    setModel(prevState => ({ ...prevState, [name]: value }));
  };

  const onSubmit = event => {
    event.preventDefault();
  };

  const linkAccount = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/mojang/uuid/${model.name}`)
      .then(response => {
        const mojangUser = response.data;
        if (!mojangUser) {
          setError("User data not found!");
          return;
        }
        axios
          .put(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
            mojang: mojangUser
          })
          .then(() => {
            user.update({
              mojang: mojangUser
            });
            snackbar.add({ message: "Minecraft account linked!" });
            closeDialog();
          })
          .catch(error => {
            setError("Log in successful. Failed to update user account!");
          });
      })
      .catch(err => {
        setError(err.response.data.message);
      });
  };

  const closeDialog = () => {
    // reset state
    setModel({
      name: ""
    });
    setError("");
    handleClose();
  };
  const classes = useStyles();

  return (
    <>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <form onSubmit={onSubmit}>
          <DialogTitle id="form-dialog-title">
            Link Minecraft Account
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert className={classes.error} severity="error">
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="normal"
              id="name"
              label="Minecraft Name"
              fullWidth
              variant="outlined"
              value={model.name}
              onChange={handleChange("name")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={linkAccount} color="primary" type="submit">
              Link
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  error: {
    marginBottom: theme.spacing(2)
  }
}));
