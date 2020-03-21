import React, { useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";

import Avatar from "@material-ui/core/Avatar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

const Login = ({ onSuccess }) => {
  const [state, setState] = useState({
    error: ""
  });
  const [model, setModel] = useState({
    name: "",
    username: "",
    password: ""
  });
  const [register, setRegister] = useState(false);

  const toggleRegister = () => {
    setRegister(!register);
  };

  const onSubmit = event => {
    event.preventDefault();
    setState({ error: "" });
    if (register) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/users/register`, model)
        .then(response => {
          setRegister(false);
        })
        .catch(error => {
          setState({ error: error.response.data.message });
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/users/auth`, model)
        .then(response => {
          const accessToken = response.data.accessToken;
          if (accessToken) {
            const decoded = jwt.decode(accessToken);
            const now = parseInt(new Date().getTime() / 1000, 10);
            const timeOffset = now - decoded.iat;
            if (Math.abs(timeOffset) > 30) {
              localStorage.setItem("timeOffset", timeOffset);
            }
            localStorage.setItem("accessToken", accessToken);
            onSuccess();
          }
        })
        .catch(error => {
          setState({ error: "Invalid Username/Password" });
        });
    }
  };

  const handleChange = field => event => {
    const value = event.target.value;
    setModel(prevState => ({ ...prevState, [field]: value }));
  };

  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <FontAwesomeIcon icon={faKey} />
          </Avatar>
          <Typography component="h1" variant="h5">
            {register && "Register"}
            {!register && "Log In"}
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            {state.error && <Alert severity="error">{state.error}</Alert>}
            {register && (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoFocus
                onChange={handleChange("name")}
              />
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email"
              name="username"
              autoFocus
              onChange={handleChange("username")}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange("password")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {register && "Register"}
              {!register && "Log In"}
            </Button>
            {!register && <Button onClick={toggleRegister}>Register</Button>}
            {/* <Button>Forgot Password?</Button> */}
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: "url(/login.png)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default Login;
