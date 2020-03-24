import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { BrowserRouter as Router } from "react-router-dom";

import { CssBaseline } from "@material-ui/core";

import { SnackbarProvider } from "./context/Snackbar";
import Login from "./views/Login";
import AuthenticatedApp from "./AuthenticatedApp";
import { UserProvider } from "./context/User";

axios.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + accessToken;
    }
    return config;
  },
  error => {
    if (401 === error.response.status) {
      // if api get's 401, refresh to trigger login screen
      window.location.reload();
    } else {
      Promise.reject(error);
    }
  }
);

function App() {
  const [authenticated, setAuthenticated] = useState("loading");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setAuthenticated(false);
      return;
    }

    const timeOffset = localStorage.getItem("timeOffset");
    const decoded = jwt.decode(accessToken);
    let now = parseInt(new Date().getTime() / 1000, 10);
    if (timeOffset) {
      now = now - timeOffset;
    }
    if (now < decoded.exp) {
      setAuthenticated(true);
    } else {
      axios
        .post(`/api/v1/users/auth/validate`, { accessToken })
        .then(() => {
          setAuthenticated(true);
        })
        .catch(() => {
          setAuthenticated(false);
        });
    }
  }, []);

  const onLogin = () => {
    setAuthenticated(true);
  };

  if (authenticated === "loading") {
    return null;
  }
  return (
    <SnackbarProvider>
      <CssBaseline />
      {authenticated && (
        <Router>
          <UserProvider>
            <AuthenticatedApp />
          </UserProvider>
        </Router>
      )}
      {!authenticated && <Login onSuccess={onLogin} />}
    </SnackbarProvider>
  );
}


export default App;
