import React, { useEffect, useState } from "react";
import axios from "axios";

import MUIDataTable from "mui-datatables";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import { makeStyles } from "@material-ui/core/styles";

const Stats = ({ id }) => {
  const [stats, setStats] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/players/${id}/stats`)
      .then(response => {
        const data = response.data.stats;
        setData(data);
        let results = [];
        const custom = data["minecraft:custom"];
        if (custom["minecraft:play_one_minute"]) {
          results.push({
            name: "Play Time",
            value: ticksToHumanReadable(custom["minecraft:play_one_minute"])
          });
        }
        if (custom["minecraft:mob_kills"]) {
          results.push({
            name: "Mob Kills",
            value: custom["minecraft:mob_kills"]
          });
        }
        if (custom["minecraft:deaths"]) {
          results.push({
            name: "Deaths",
            value: custom["minecraft:deaths"]
          });
        }
        setStats(results);
      })
      .catch(error => {
        // do nothing
      });
  }, [id]);

  const ticksToHumanReadable = ticks => {
    const sec = ticks * 0.05;
    const seconds = Math.floor((((sec % 31536000) % 86400) % 3600) % 60);
    const minutes = Math.floor((((sec % 31536000) % 86400) % 3600) / 60);
    const hours = Math.floor(((sec % 31536000) % 86400) / 3600);
    const days = Math.floor((sec % 31536000) / 86400);
    const years = Math.floor(sec / 31536000);

    let response = "";
    if (years >= 1) {
      response += years + " years ";
    }
    if (days >= 1) {
      response += days + " days ";
    }
    if (hours >= 1) {
      response += hours + " hours ";
    }
    if (minutes >= 1) {
      response += minutes + " minutes ";
    }
    if (seconds >= 1) {
      response += seconds + " seconds";
    }
    return response;
  };

  const cmToHumanReadable = cm => {
    const feet = Math.floor((cm % 160934) / 30.48);
    const miles = Math.floor(cm / 160934);

    let response = "";
    if (miles >= 1) {
      response += miles + " miles ";
    }
    if (feet >= 1) {
      response += feet + " feet ";
    }
    return response;
  };

  const columns = [
    { name: "name", label: "Name" },
    { name: "value", label: "Value" }
  ];

  const classes = useStyles();

  const rowStats = (rowData, rowMeta) => {
    const results = [];
    const custom = data["minecraft:custom"];
    if (rowData[0] === "Mob Kills") {
      results.push(
        <TableRow className={classes.expanded}>
          <TableCell />
          <TableCell>Damage Dealt</TableCell>
          <TableCell>{custom["minecraft:damage_dealt"]}</TableCell>
        </TableRow>
      );
      const killed = data["minecraft:killed"];
      Object.keys(killed).forEach(key => {
        const name = key.slice(10).replace("_", " ");
        results.push(
          <TableRow className={classes.expanded} key={name}>
            <TableCell align="right">
              <img
                src={`/images/${key.slice(10)}.png`}
                className={classes.faceIcon}
                alt=""
              />
            </TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{killed[key]}</TableCell>
          </TableRow>
        );
      });
      return results;
    } else if (rowData[0] === "Deaths") {
      results.push(
        <TableRow className={classes.expanded}>
          <TableCell />
          <TableCell>Damage Taken</TableCell>
          <TableCell>{custom["minecraft:damage_taken"]}</TableCell>
        </TableRow>
      );
      const killedBy = data["minecraft:killed_by"];
      Object.keys(killedBy).forEach(key => {
        const name = key.slice(10).replace("_", " ");
        results.push(
          <TableRow className={classes.expanded} key={name}>
            <TableCell>
              <img
                src={`/images/${key.slice(10)}.png`}
                className={classes.faceIcon}
                alt=""
              />
            </TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{killedBy[key]}</TableCell>
          </TableRow>
        );
      });
      return results;
    } else if (rowData[0] === "Play Time") {
      const items = [
        {
          key: "walk_one_cm",
          label: "Walk Distance",
          distance: true
        },
        {
          key: "sprint_one_cm",
          label: "Sprint Distance",
          distance: true
        },
        {
          key: "crouch_one_cm",
          label: "Crouch Distance",
          distance: true
        },
        {
          key: "fall_one_cm",
          label: "Fall Distance",
          distance: true
        },
        // {
        //   key: "fly_one_cm",
        //   label: "Fly Distance",
        //   distance: true
        // },
        {
          key: "jump",
          label: "Times Jumped"
        },
        {
          key: "leave_game",
          label: "Left Game"
        },
        {
          key: "sneak_time",
          label: "Sneak Time",
          time: true
        },
        {
          key: "time_since_rest",
          label: "Time Since Last Sleep",
          time: true
        },
        {
          key: "time_since_death",
          label: "Time Since Death",
          time: true
        }
      ];
      items.forEach(item => {
        let value = custom["minecraft:" + item.key];
        if (item.time) {
          value = ticksToHumanReadable(value);
        } else if (item.distance) {
          value = cmToHumanReadable(value);
        }
        results.push(
          <TableRow className={classes.expanded} key={item.label}>
            <TableCell />
            <TableCell>{item.label}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        );
      });
      return results;
    }

    return null;
  };

  if (stats) {
    return (
      <MUIDataTable
        columns={columns}
        data={stats}
        title="Stats"
        options={{
          print: false,
          download: false,
          viewColumns: false,
          search: false,
          filter: false,
          selectableRows: false,
          expandableRows: true,
          renderExpandableRow: rowStats,
          pagination: false
        }}
      />
    );
  }
  return null;
};

const useStyles = makeStyles(theme => ({
  expanded: {
    backgroundColor: "rgba(0, 0, 0, 0.02)"
  },
  faceIcon: {
    width: 20,
    height: 20
  }
}));

export default Stats;
