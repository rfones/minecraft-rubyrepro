import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

export default function Add({ open, handleClose, level, userEdit = {} }) {
  const [found, setFound] = useState(false);
  const [model, setModel] = useState({
    name: "",
    uuid: "",
    level: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (userEdit.uuid) {
      setFound(true);
      setModel(prevState => ({ ...prevState, ...userEdit }));
    }
  }, [userEdit]);

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
          setModel(prevState => ({ ...prevState, uuid: response.data.id }));
          setFound(true);
          setError("");
        } else {
          setError(`User "${model.name}" not found!`);
        }
      });
  };

  const addUser = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/users`, model)
      .then(response => {
        closeDialog();
      })
      .catch(err => {
        setFound(false);
        setError(err.response.data.message);
      });
  };

  const closeDialog = () => {
    // reset state
    setFound(false);
    setModel({
      name: "",
      uuid: "",
      level: ""
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
      >
        <form onSubmit={onSubmit}>
          <DialogTitle id="form-dialog-title">
            {userEdit.uuid ? "Edit" : "Add"} User
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
                    src={`https://crafatar.com/avatars/${model.uuid}`}
                    alt={model.name}
                    width="80"
                    height="80"
                    style={{ marginRight: 8 }}
                  />
                  <div className={classes.username}>{model.name}</div>
                  <div className={classes.userid}>{model.uuid}</div>
                </div>
                {level > 0 && (
                  <TextField
                    id="level"
                    label="Permissions"
                    fullWidth
                    variant="outlined"
                    value={model.level}
                    onChange={handleChange("level")}
                    select
                  >
                    <MenuItem value="">Whitelist</MenuItem>
                    <MenuItem value="0">Op - Level 0</MenuItem>
                    {level >= 1 && <MenuItem value="1">Op - Level 1</MenuItem>}
                    {level >= 2 && <MenuItem value="2">Op - Level 2</MenuItem>}
                    {level >= 3 && <MenuItem value="3">Op - Level 3</MenuItem>}
                    {level >= 4 && <MenuItem value="4">Op - Level 4</MenuItem>}
                  </TextField>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Cancel
            </Button>
            {found && (
              <Button onClick={addUser} color="primary" type="submit">
                {userEdit.uuid ? "Save" : "Add"}
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
  }
}));
