const express = require("express");
const players = express.Router();

const Players = require("../../services/players");

players.get("/", function(req, res) {
  const playersService = new Players();
  const json = playersService.getAll();
  res.json(json);
});

players.get("/:uuid", function(req, res) {
  const playersService = new Players();
  let uuid = req.params.uuid;

  playersService
    .get(uuid)
    .then(response => {
      return res.send(response);
    })
    .catch(error => {
      return res.status(400).send({ message: error });
    });
});

players.get("/:uuid/stats", function(req, res) {
  const playersService = new Players();
  let uuid = req.params.uuid;

  playersService
    .getStats(uuid)
    .then(response => {
      return res.send(response);
    })
    .catch(error => {
      return res.status(400).send({ message: error });
    });
});

players.put("/:uuid", function(req, res) {
  if (
    (!req.user.groups || !req.user.groups.includes("superusers")) &&
    req.user.id !== req.params.id
  ) {
    return res.status(403).send({ message: "Access denied!" });
  }
  const playersService = new Players();
  let uuid = req.params.uuid;
  playersService
    .save({ uuid, ...req.body })
    .then(response => {
      return res.send(response);
    })
    .catch(error => {
      return res.status(400).send({ message: error });
    });
});

players.post("/", function(req, res) {
  const playersService = new Players();

  let errors = [];
  let name = req.body.name;
  let uuid = req.body.uuid;
  let level = req.body.level;
  if (!name) {
    errors.push({
      field: "name",
      message: "is required"
    });
  }
  if (!uuid) {
    errors.push({
      field: "uuid",
      message: "is required"
    });
  }

  if (errors.length) {
    res.status(400).send({ message: "validation errors", errors });
    return;
  }

  // make sure uuid is formatted with dashes, required by whitelist.json
  if (uuid.length === 32) {
    uuid =
      uuid.substr(0, 8) +
      "-" +
      uuid.substr(8, 4) +
      "-" +
      uuid.substr(12, 4) +
      "-" +
      uuid.substr(16, 4) +
      "-" +
      uuid.substr(20);
  }

  // insert/update player
  playersService
    .save({
      name: name,
      uuid: uuid,
      level: level
    })
    .then(response => {
      res.send({ success: true });
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

players.delete("/:uuid", function(req, res) {
  const playersService = new Players();
  let errors = [];
  let uuid = req.params.uuid;

  if (!uuid) {
    errors.push({
      field: "uuid",
      message: "is required"
    });
  }

  if (errors.length) {
    res.status(400).send({ message: "validation errors", errors });
    return;
  }

  playersService
    .delete(uuid)
    .then(response => {
      return res.send({ success: true });
    })
    .catch(error => {
      return res.status(400).send({ message: error });
    });
});

module.exports = players;
