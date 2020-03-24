import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import {
  Typography,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { useUser } from "../../context/User";
import { useSnackbar } from "../../context/Snackbar";
import Stats from "./Stats";

const User = () => {
  const { id } = useParams();
  const [error, setError] = useState();
  const [player, setPlayer] = useState({});
  const [isOp, setIsOp] = useState(false);

  const user = useUser();
  const snackbar = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/players/${id}`)
      .then(response => {
        if (response.data.level >= 1) {
          setIsOp(true);
        }
        setPlayer(response.data);
      })
      .catch(error => {
        setError(error.response.data.message);
      });
  }, [id]);

  const handleOp = event => {
    setIsOp(event.target.checked);
    if (event.target.checked === false) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/players/${id}`, {
          level: 0
        })
        .then(response => {
          setPlayer(prevState => ({ ...prevState, ...response.data }));
        })
        .catch(error => {
          console.error(error);
          snackbar.add({
            message: error.response.data.message,
            severity: "error"
          });
        });
    }
  };

  const updatePlayerLevel = event => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/players/${id}`, {
        level: event.target.value
      })
      .then(response => {
        setPlayer(prevState => ({ ...prevState, ...response.data }));
      })
      .catch(error => {
        snackbar.add({
          message: error.response.data.message,
          severity: "error"
        });
      });
  };

  const removePlayer = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/players/${player.uuid}`)
      .then(response => {
        let playerCopy = { ...player };
        snackbar.add({
          message: `${player.name} removed!`,
          undoAction: () => {
            axios
              .post(`${process.env.REACT_APP_API_URL}/players`, playerCopy)
              .then(response => {
                snackbar.add({ message: `${playerCopy.name} restored!` });
              })
              .catch(err => {
                setError(
                  (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                    "Error"
                );
              });
          }
        });
        history.goBack();
      })
      .catch(err => {
        setError(
          (err.response && err.response.data && err.response.data.message) ||
            "Error"
        );
      });
  };

  const classes = useStyles();

  if (error) {
    return (
      <Typography variant="h5" component="h2">
        {error}
      </Typography>
    );
  }

  if (player.uuid) {
    return (
      <>
        <div className={classes.header}>
          <div className={classes.username}>
            <Typography variant="body2">
              <Link to="/players" className={classes.link}>
                &laquo; Players
              </Link>
            </Typography>
            <Typography variant="h2" paragraph>
              {player.name}
            </Typography>
          </div>
          {user.canEdit("user.level") && (
            <form className={classes.quickEdit}>
              <FormControlLabel
                control={<Switch name="op" color="primary" />}
                checked={isOp}
                label="Op"
                onChange={handleOp}
              />
              {isOp && (
                <TextField
                  id="level"
                  label="Op Level"
                  variant="outlined"
                  select
                  margin="dense"
                  value={player.level || ""}
                  className={classes.level}
                  onChange={updatePlayerLevel}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </TextField>
              )}
              <div className={classes.remove}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.input}
                  onClick={removePlayer}
                  startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
                >
                  Remove from Whitelist
                </Button>
              </div>
            </form>
          )}
        </div>
        <Stats id={id} />
      </>
    );
  }
  return null;
};

const useStyles = makeStyles(theme => ({
  columns: {
    display: "flex"
  },
  main: {
    flexGrow: 1,
    marginLeft: theme.spacing(4)
  },
  header: {
    display: "flex",
    alignItems: "center"
  },
  username: {
    flexGrow: 1
  },
  quickEdit: {
    display: "flex",
    flexDirection: "row-reverse"
  },
  level: {
    width: 150,
    marginRight: theme.spacing(2)
  },
  remove: {
    alignSelf: "center"
  },
  input: {
    marginRight: theme.spacing(2)
  },
  body: {
    height: 270,
    width: 120
  },
  link: {
    textDecoration: "none"
  }
}));
export default User;
