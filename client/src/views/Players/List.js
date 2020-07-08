import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import {
  Button,
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

import Add from "../../dialogs/WhitelistUser";
import { useUser } from "../../context/User";

const List = () => {
  const [open, setOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const [serverInfo, setServerInfo] = useState({});

  const user = useUser();
  const history = useHistory();

  const fetchPlayers = useCallback(source => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/players`, {
        cancelToken: source.token
      })
      .then(response => {
        let data = response.data;
        data.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        });
        setPlayers(data);
      });
  }, []);

  const fetchServer = useCallback(source => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/server`, {
        cancelToken: source.token
      })
      .then(response => {
        setServerInfo(response.data);
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.log("server offline");
        }
      });
  }, []);

  useEffect(() => {
    let source = axios.CancelToken.source();
    fetchPlayers(source);
    fetchServer(source);
    return () => {
      source.cancel();
    };
  }, [fetchPlayers, fetchServer]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = model => {
    setOpen(false);
    const data = [...players];
    data.push(model);
    data.sort((a, b) => {
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      return 0;
    });
    setPlayers(data);
  };

  const viewPlayer = player => () => {
    history.push(`/players/${player.uuid}`);
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

  const rowClasses = player => {
    let cls = [classes.clickable];
    if (
      user.mojang &&
      player.uuid.replace(/-/g, "") === user.mojang.id.replace(/-/g, "")
    ) {
      cls.push(classes.self);
    }
    return cls.join(" ");
  };

  return (
    <>
      <div className={classes.header}>
        <div className={classes.title}>
          <Typography variant="h2" paragraph>
            Players
          </Typography>
        </div>
        <div>
          {user.canEdit('player.level') && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={handleClickOpen}
              >
                Whitelist Player
              </Button>
              <Add open={open} handleClose={handleClose} />
            </>
          )}
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="Players">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {user.canEdit('player.level') && <TableCell align="right">Op Level</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map(player => (
              <TableRow
                key={player.name}
                className={rowClasses(player)}
                onClick={viewPlayer(player)}
              >
                <TableCell scope="row">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      className={classes.avatar}
                      src={`https://crafatar.com/avatars/${player.uuid}?size=20`}
                      alt={player.name}
                    />
                    {player.name}
                    {getOnlineStatus(player.uuid)}
                    {player.level === "0" && (
                      <FontAwesomeIcon
                        icon={farStar}
                        className={classes.star}
                        title={`Op - Level ${player.level}`}
                      />
                    )}
                    {player.level > 0 && (
                      <FontAwesomeIcon
                        icon={fasStar}
                        className={classes.star}
                        title={`Op - Level ${player.level}`}
                      />
                    )}
                  </div>
                </TableCell>
                {user.canEdit('player.level') && (
                  <TableCell align="right">
                    {player.level ? player.level : "-"}
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
  header: {
    display: "flex",
    alignItems: "center"
  },
  title: {
    flexGrow: 1
  },
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
    marginRight: theme.spacing(1),
    width: 20,
    height: 20
  },
  online: {
    backgroundColor: "#98fb98",
    marginLeft: theme.spacing(0.5),
    boxShadow: "0 0 4px rgba(0, 0, 0, 0.5)",
    borderRadius: "40px",
    border: "1px solid #090",
    width: "14px",
    height: "14px"
  },
  star: {
    color: "#fc0",
    marginLeft: theme.spacing(0.5)
  }
}));

export default List;
