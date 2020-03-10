const express = require("express");
const api = express.Router();

const v1 = require("./v1");

api.use("/v1", v1);

api.get("/", function(req, res) {
  res.send("api");
});

module.exports = api;
