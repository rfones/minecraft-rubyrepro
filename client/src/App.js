import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";

import { SnackbarProvider } from "./context/Snackbar";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
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
    Promise.reject(error);
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
    return <></>;
  }
  return (
    <SnackbarProvider>
      {authenticated && (
        <UserProvider>
          <Dashboard />
        </UserProvider>
      )}
      {!authenticated && <Login onSuccess={onLogin} />}
    </SnackbarProvider>
  );
}

export default App;
