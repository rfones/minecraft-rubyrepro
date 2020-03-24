import React from "react";
import { Switch, Route } from "react-router-dom";

import Player from "./Player";
import List from "./List";

const Players = () => {
  return (
    <Switch>
      <Route path="/players/:id" component={Player} />
      <Route path="/players" component={List} />
    </Switch>
  );
};

export default Players;
