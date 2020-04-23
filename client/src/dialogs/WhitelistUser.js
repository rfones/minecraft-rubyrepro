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

export default function Add({ open, handleClose }) {
  const [found, setFound] = useState(false);
  const [model, setModel] = useState({
    name: "",
    uuid: ""
  });
  const [error, setError] = useState("");
  const snackbar = useSnackbar();

  const handleChange = name => event => {
    const value = event.target.value;
    setModel(prevState => ({ ...prevState, [name]: value }));
  };

  const onSubmit = event => {
    event.preventDefault();
  };

  const findUser = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/mojang/uuid/${model.name}`)
      .then(response => {
        if (response.data && response.data.id) {
          setModel(prevState => ({ ...prevState, uuid: response.data.id, name: response.data.name }));
          setFound(true);
          setError("");
        } else {
          setError(`User "${model.name}" not found!`);
        }
      });
  };

  const addUser = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/players`, model)
      .then(response => {
        snackbar.add({ message: `${model.name} whitelisted!` });
        closeDialog();
      })
      .catch(err => {
        setFound(false);
        setError(
          (err.response && err.response.data && err.response.data.message) ||
            "Error"
        );
      });
  };

  const closeDialog = () => {
    // reset state
    setFound(false);
    setModel({
      name: "",
      uuid: ""
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
           Whitelist Player
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert className={classes.error} severity="error">
                {error}
              </Alert>
            )}
            {!found && (
              <TextField
                autoFocus
                id="name"
                label="Minecraft Name"
                fullWidth
                variant="outlined"
                value={model.name}
                onChange={handleChange("name")}
              />
            )}
            {model.name && model.uuid && (
              <>
                <div className={classes.foundUser}>
                  <img
                    src={`https://crafatar.com/avatars/${model.uuid}?size=80`}
                    alt={model.name}
                    className={classes.avatar}
                  />
                  <div className={classes.username}>{model.name}</div>
                  <div className={classes.userid}>{model.uuid}</div>
                </div>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Cancel
            </Button>
            {found && (
              <Button onClick={addUser} color="primary" type="submit">
                Whitelist
              </Button>
            )}
            {!found && (
              <Button onClick={findUser} color="primary" type="submit">
                Find
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  foundUser: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    margin: theme.spacing(1, 0)
  },
  avatar: {
    marginRight: theme.spacing(1),
    width: 80,
    height: 80
  },
  username: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: theme.spacing(0.5, 0)
  },
  userid: {
    fontSize: "11px"
  },
  error: {
    marginBottom: theme.spacing(2)
  },
  secondaryAction: {
    flexGrow: 1
  }
}));
