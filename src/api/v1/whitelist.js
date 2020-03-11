const express = require("express");
const whitelist = express.Router();

const Whitelist = require("../../services/whitelist");

whitelist.get("/", function(req, res) {
  const whitelistService = new Whitelist();
  const json = whitelistService.get();
  res.json(json);
});

module.exports = whitelist;
