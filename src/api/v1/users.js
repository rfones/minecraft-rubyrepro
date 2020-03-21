const express = require("express");
const users = express.Router();

const authentication = require("./middleware/authentication");
const Users = require("../../services/users");

users.post("/register", async function(req, res) {
  const usersService = new Users();

  let errors = [];
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
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

  const result = await usersService.registerUser({ name, username, password });

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
});

users.use(authentication);

users.put("/:id", async function(req, res) {
  if (req.user.id !== req.params.id) {
    return res.status(403).send({ message: "Access denied!" });
  }
  const usersService = new Users();
  result = await usersService.update({ ...req.body, id: req.params.id });
  if (result.success) {
    res.send(result);
    return;
  }
  res.status(400).send(result);
});

module.exports = users;
