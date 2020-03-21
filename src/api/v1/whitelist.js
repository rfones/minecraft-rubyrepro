const express = require("express");
const whitelist = express.Router();

const Whitelist = require("../../services/whitelist");

whitelist.get("/", function(req, res) {
  const whitelistService = new Whitelist();
  const json = whitelistService.getAll();
  res.json(json);
});

whitelist.post("/", function(req, res) {
  const whitelistService = new Whitelist();
  const users = whitelistService.getAll();

  let errors = [];
  let name = req.body.name;
  let uuid = req.body.uuid;
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
  if (uuid.legnth === 32) {
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
  whitelistService
    .save({
      name: req.body.name,
      uuid: req.body.uuid,
      level: req.body.level
    })
    .then(response => {
      res.send({ success: true });
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

module.exports = whitelist;
