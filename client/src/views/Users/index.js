import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Button,
  Toolbar,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faStar } from "@fortawesome/free-solid-svg-icons";

import Add from './Add';

const Users = () => {
  const [state, setState] = useState({
    isOp: false,
    level: 0
  });
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [userEdit, setUserEdit] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    const user = users.find(
        user =>
          user.uuid &&
          user.uuid.replace(/-/g, "") === localUser.id.replace(/-/g, "")
      );
      if (user && user.level >= 0) {
        setState({
            isOp: true,
            level: user.level
        });
      }
  }, [users])

  const fetchUsers = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`).then(response => {
        let data = response.data;
        data.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        });
        setUsers(data);
      });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setUserEdit({});
    setOpen(false);
    fetchUsers();
  };

  const editUser = user => () => {
    if (!state.isOp) return;
    setUserEdit(user);
    setOpen(true);
  }

  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" component="h2">
        Users
      </Typography>
      {state.isOp && (
          <>
        <Toolbar>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleClickOpen}
          >
            Add User
          </Button>
        </Toolbar>
        <Add open={open} handleClose={handleClose} level={state.level} userEdit={userEdit} />
        </>
      )}
      <TableContainer component={Paper}>
        <Table aria-label="Users">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {state.isOp && <TableCell align="right">Op Level</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow
                key={user.name}
                className={state.isOp ? classes.clickable : ""}
                onClick={editUser(user)}
              >
                <TableCell scope="row">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`https://crafatar.com/avatars/${user.uuid}`}
                      alt={user.name}
                      width="20"
                      height="20"
                      style={{ marginRight: 8 }}
                    />
                    {user.name}
                    {user.level >= 0 && (
                      <FontAwesomeIcon icon={faStar} className={classes.star} title={`Op - Level ${user.level}`} />
                    )}
                  </div>
                </TableCell>
                {state.isOp && (
                  <TableCell align="right">
                    {user.level ? user.level : "-"}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  clickable: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#eee"
    }
  },
  star: {
    color: "#fc0",
    marginLeft: theme.spacing(0.5)
  }
}));

export default Users;
