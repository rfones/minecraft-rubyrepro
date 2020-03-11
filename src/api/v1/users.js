const express = require("express");
const users = express.Router();

const Users = require("../../services/users");

users.get("/", function(req, res) {
  const usersService = new Users();
  const json = usersService.getAll();
  res.json(json);
});

module.exports = users;
