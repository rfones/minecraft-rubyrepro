import React, { useEffect, useState } from "react";
import axios from "axios";

import MUIDataTable from "mui-datatables";

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
        console.log(results);
        setStats(results);
      })
      .catch(error => {
        // do nothing
      });
  }, [id]);

  const rowStats = (rowData, rowMeta) => {
    if (rowData.name === "Mob Kills") {
      data["minecraft:killed"].forEach(row => {});
    }
    return null;
  };

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
          // expandableRows: true,
          // renderExpandableRow: rowStats,
          pagination: false
        }}
      />
    );
  }
  return null;
};

const useStyles = makeStyles(theme => ({}));

export default Stats;
