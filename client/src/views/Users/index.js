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
import { faPlus, faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

import Add from "./Add";

const Users = () => {
  const [state, setState] = useState({
    isOp: false,
    level: 0
  });
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [serverInfo, setServerInfo] = useState({});
  const [userEdit, setUserEdit] = useState({});

  const localUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchUsers();
    fetchServer();
  }, []);

  useEffect(() => {
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
  }, [users, localUser.id]);

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
  };

  const fetchServer = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/server`).then(response => {
      setServerInfo(response.data);
    })
    .catch(error => {
      console.log("server offline");
    });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setUserEdit({});
    setOpen(false);
    fetchUsers();
  };

  const editUser = user => () => {
    if (
      !state.isOp ||
      user.uuid.replace(/-/g, "") === localUser.id.replace(/-/g, "")
    )
      return;
    setUserEdit(user);
    setOpen(true);
  };

  const classes = useStyles();

  const getOnlineStatus = uuid => {
    if (serverInfo && serverInfo.players) {
      const player = serverInfo.players.find(
        player =>
          player.id && player.id.replace(/-/g, "") === uuid.replace(/-/g, "")
      );
      if (player) {
        return <div className={classes.online} title="Online" />;
      }
      return null;
    }
  };

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
          <Add
            open={open}
            handleClose={handleClose}
            level={state.level}
            userEdit={userEdit}
          />
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
                className={
                  user.uuid.replace(/-/g, "") === localUser.id.replace(/-/g, "")
                    ? classes.self
                    : state.isOp
                    ? classes.clickable
                    : ""
                }
                onClick={editUser(user)}
              >
                <TableCell scope="row">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      className={classes.avatar}
                      src={`https://crafatar.com/avatars/${user.uuid}?size=20`}
                      alt={user.name}
                    />
                    {user.name}
                    {getOnlineStatus(user.uuid)}
                    {user.level === "0" && (
                      <FontAwesomeIcon
                        icon={farStar}
                        className={classes.star}
                        title={`Op - Level ${user.level}`}
                      />
                    )}
                    {user.level > 0 && (
                      <FontAwesomeIcon
                        icon={fasStar}
                        className={classes.star}
                        title={`Op - Level ${user.level}`}
                      />
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
  self: {
    backgroundColor: "#ffc"
  },
  avatar: {
    marginRight: theme.spacing(1)
  },
  online: {
    backgroundColor: "#98fb98",
    marginLeft: theme.spacing(0.5),
    boxShadow: "0 0 4px rgba(0, 0, 0, 0.5)",
    borderRadius: "40px",
    border: "1px solid #090",
    width: '14px',
    height: '14px'
  },
  star: {
    color: "#fc0",
    marginLeft: theme.spacing(0.5)
  }
}));

export default Users;
