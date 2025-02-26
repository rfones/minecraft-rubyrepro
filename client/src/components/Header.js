import React, { useEffect, useState } from "react";
import axios from 'axios';

import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useUser } from "../context/User";
import Nav from "./Nav";

const Header = () => {
  const user = useUser();

  const [serverInfo, setServerInfo] = useState({});
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/server`)
      .then(response => {
        setServerInfo(response.data);
      })
      .catch(error => {
        setServerInfo({ message: "Unable to load server info" });
      });
  }, []);

  const classes = useStyles();

  const getServerInfo = () => {
    if (serverInfo && serverInfo.raw && serverInfo.raw.vanilla) {
      return (
        <div className={classes.heading}>
          <Typography variant="h6">
            {serverInfo.name || serverInfo.raw.vanilla.raw.description.text}
          </Typography>
          <Typography variant="body2">
            Players {serverInfo.raw.vanilla.raw.players.online} /{" "}
            {serverInfo.maxplayers || serverInfo.raw.vanilla.raw.players.max} - {" "}
            {serverInfo.raw.vanilla.raw.version.name}
          </Typography>
        </div>
      );
    } else if (serverInfo.message) {
      return (
        <div className={classes.heading}>
          <Typography variant="h6">minecraft.rubyrepro.com</Typography>
          <Typography variant="body2">{serverInfo.message}</Typography>
        </div>
      );
    }
    return (
      <Typography variant="h6" className={classes.heading}>
        minecraft.rubyrepro.com
      </Typography>
    );
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {getServerInfo()}
        <div className={classes.userInfo}>
          {user.name}
          {user.mojang && (
            <img
              src={`https://crafatar.com/avatars/${user.mojang.id}?size=32`}
              alt={user.mojang.name}
              className={classes.avatar}
            />
          )}
          <Nav />
        </div>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles(theme => ({
  heading: {
    flexGrow: 1
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    fontSize: "18px"
  },
  avatar: {
    marginLeft: theme.spacing(1),
    width: 32,
    height: 32
  },
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4)
  }
}));

export default Header;
