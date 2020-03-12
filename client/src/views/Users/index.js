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
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Users = () => {
  const [state, setState] = useState({
    canAdd: false,
    canOp: false
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    axios.get(`${process.env.REACT_APP_API_URL}/users`).then(response => {
      let data = response.data;
      data.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        return 0;
      });
      setUsers(data);
      const user = data.find(
        user =>
          user.uuid &&
          user.uuid.replace(/-/g, "") === localUser.id.replace(/-/g, "")
      );
      console.log(user);
      if (user && user.level) {
        let newState = { ...state };
        if (user.level >= 0) {
          newState.canAdd = true;
        }
        if (user.level >= 4) {
          newState.canOp = true;
        }
        setState(newState);
      }
    });
  }, []);

  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" component="h2">
        Whitelisted Users
      </Typography>
      {state.canAdd && (
        <Toolbar>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            Add User
          </Button>
        </Toolbar>
      )}
      <TableContainer component={Paper}>
        <Table aria-label="Users">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Op Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow
                key={user.name}
                className={state.canAdd ? classes.clickable : ""}
              >
                <TableCell scope="row">
                  <div style={{ display: "flex" }}>
                    <img
                      src={`https://crafatar.com/avatars/${user.uuid}`}
                      alt={user.name}
                      width="20"
                      height="20"
                      style={{ marginRight: 8 }}
                    />
                    {user.name}
                  </div>
                </TableCell>
                <TableCell align="right">
                  {user.level ? user.level : "-"}
                </TableCell>
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
  }
}));

export default Users;
