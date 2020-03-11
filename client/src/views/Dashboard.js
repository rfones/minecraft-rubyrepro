import React from "react";

import { CssBaseline, AppBar, Toolbar, Typography, Container } from "@material-ui/core";

import Users from "./Users";

const Dashbaord = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            minecraft.rubyrepro.com
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <p>Welcome {user.name}</p>
        <Users />
      </Container>
    </>
  );
};

export default Dashbaord;
