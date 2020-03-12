import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

export default function Add({ open, handleClose, level }) {
  const [found, setFound] = useState(false);
  const [model, setModel] = useState({
    name: "",
    uuid: "",
    level: ""
  });
  const [user, setUser] = useState({
    name: "",
    id: ""
  });

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
        setUser(response.data);
        setModel(prevState => ({ ...prevState, uuid: response.data.id }));
        setFound(true);
      });
  };

  const addUser = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/users`, model)
      .then(response => {
        console.log("addUser");
        // reset state
        setFound(false);
        setModel({
          name: "",
          uuid: "",
          level: ""
        });
        setUser({
          name: "",
          id: ""
        });
        handleClose();
      })
      .catch(err => {
          alert(err.response.data.message);
        console.error(err.response.data.message);
      });
  };

  const classes = useStyles();

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={onSubmit}>
          <DialogTitle id="form-dialog-title">Add User</DialogTitle>
          <DialogContent>
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
            {user.name && user.id && (
              <>
                <div className={classes.foundUser}>
                  <img
                    src={`https://crafatar.com/avatars/${user.id}`}
                    alt={user.name}
                    width="80"
                    height="80"
                    style={{ marginRight: 8 }}
                  />
                  <div className={classes.username}>{user.name}</div>
                  <div className={classes.userid}>{user.id}</div>
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
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {found && (
              <Button onClick={addUser} color="primary" type="submit">
                Add
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
  }
}));
