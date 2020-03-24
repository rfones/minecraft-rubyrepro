import React from "react";
import { Link } from "react-router-dom";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import LinkMinecraft from "../dialogs/LinkMinecraft";
import { useUser } from "../context/User";

const useStyles = makeStyles(theme => ({
  button: {
    color: "#fff"
  },
  list: {
    width: 250
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    fontSize: "18px",
    padding: theme.spacing(1, 2)
  },
  username: {
    flexGrow: 1
  },
  avatar: {
    marginRight: theme.spacing(1),
    width: 32,
    height: 32
  }
}));

export default function Nav() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [linkAccountOpen, setLinkAccountOpen] = React.useState(false);

  const user = useUser();

  const toggleDrawer = () => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(!open);
  };

  const linkAccount = open => () => {
    setLinkAccountOpen(open);
  };

  const logout = () => {
    user.logout();
  };

  return (
    <>
      <IconButton onClick={toggleDrawer()} className={classes.button}>
        <FontAwesomeIcon icon={faBars} />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={toggleDrawer()}>
        <div className={classes.userInfo}>
          <div className={classes.username}>
          {user.name}
          </div>
          {user.mojang && (
            <img
              src={`https://crafatar.com/avatars/${user.mojang.id}?size=32`}
              alt={user.mojang.name}
              className={classes.avatar}
            />
          )}
        </div>
        <div
          role="presentation"
          className={classes.list}
          onClick={toggleDrawer()}
          onKeyDown={toggleDrawer()}
        >
          <List>
            {!user.mojang && (
              <ListItem
                button
                key="Link Minecraft Account"
                onClick={linkAccount(true)}
              >
                <ListItemText primary="Link Minecraft Account" />
              </ListItem>
            )}
            {user.mojang && (
              <ListItem
                component={Link}
                to={`/players/${user.mojang.id}`}
                key="My Profile"
              >
                <ListItemText primary="My Profile" />
              </ListItem>
            )}
            <Divider />
            <ListItem button key="Players" component={Link}
                to={`/players`}>
              <ListItemText primary="Players" />
            </ListItem>
            <Divider />
            <ListItem button key="Log Out" onClick={logout}>
              <ListItemText primary="Log Out" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <LinkMinecraft handleClose={linkAccount(false)} open={linkAccountOpen} />
    </>
  );
}
