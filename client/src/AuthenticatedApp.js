import React from "react";
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Header from "./components/Header";
import Players from "./views/Players";

const AuthenticatedApp = () => {
  const classes = useStyles();
  return (
    <>
      <Header />
      <Container className={classes.container}>
        <Switch>
          <Route path="/players" component={Players} />
          <Redirect from="/" to="/players" />
        </Switch>
      </Container>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4)
  }
}));

export default AuthenticatedApp;
