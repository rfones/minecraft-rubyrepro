const express = require("express");
const server = express.Router();

const Server = require("../../services/server");

server.get("/", function(req, res) {
  const serverService = new Server();
  serverService
    .getInfo()
    .then(state => {
      res.json(state);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

module.exports = server;
