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

const Users = () => {
  const [state, setState] = useState({
    isOp: false,
    level: 0
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
      if (user && user.level) {
        let newState = { ...state };
        if (user.level >= 0) {
          newState.isOp = true;
          newState.level = user.level;
        }
        setState(newState);
      }
    });
  }, []);

  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" component="h2">
        Users
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
              {state.isOp && <TableCell align="right">Op Level</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow
                key={user.name}
                className={state.isOp ? classes.clickable : ""}
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
                    {user.level && parseInt(user.level, 10) && (
                      <FontAwesomeIcon icon={faStar} className={classes.star} title="Op" />
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
