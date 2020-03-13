import React from "react";

import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Users from "./Users";

const Dashbaord = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.heading}>minecraft.rubyrepro.com</Typography>
          <div className={classes.userInfo}>
            {user.name}
            <img
              src={`https://crafatar.com/avatars/${user.id}?size=32`}
              alt={user.name}
              className={classes.avatar}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <Users />
      </Container>
    </>
  );
};

const useStyles = makeStyles(theme => ({
    heading: {
        flexGrow: 1
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '18px'
    },
    avatar: {
        marginLeft: theme.spacing(1)
    },
    container: {
        marginTop: theme.spacing(2)
    }
}));

export default Dashbaord;
