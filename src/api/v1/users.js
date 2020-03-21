const express = require("express");
const users = express.Router();

const Users = require("../../services/users");

users.post("/register", async function(req, res) {
  const usersService = new Users();

  let errors = [];
  let username = req.body.username;
  let password = req.body.password;
  if (!username) {
    errors.push({
      field: "username",
      message: "is required"
    });
  }
  if (!password) {
    errors.push({
      field: "password",
      message: "is required"
    });
  }

  if (errors.length) {
    res.status(400).send({ message: "validation errors", errors });
    return;
  }

  const result = await usersService.registerUser(username, password);

  if (result.success) {
      res.send(result);
      return;
  }
  res.status(400).send(result);
});

users.post("/auth", async function(req, res) {
    const usersService = new Users();

    let errors = [];
    let username = req.body.username;
    let password = req.body.password;
    if (!username) {
      errors.push({
        field: "username",
        message: "is required"
      });
    }
    if (!password) {
      errors.push({
        field: "password",
        message: "is required"
      });
    }
  
    if (errors.length) {
      res.status(400).send({ message: "validation errors", errors });
      return;
    }

    const result = await usersService.authenticate(username, password);
    if (result.success) {
        res.send(result);
        return;
    }
    res.status(400).send(result);
})

module.exports = users;
