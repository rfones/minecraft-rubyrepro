const express = require("express");
const users = express.Router();

const authentication = require("./middleware/authentication");
const Users = require("../../services/users");

// UNAUTHENTICATED ROUTES

users.post("/register", async function(req, res) {
  const usersService = new Users();

  let errors = [];
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (!name) {
    errors.push({
      field: "name",
      message: "is required"
    });
  }  if (!email) {
    errors.push({
      field: "email",
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

  const result = await usersService.registerUser({ name, email, password });

  if (result.success) {
    res.send(result);
    return;
  }
  res.status(400).send(result);
});

users.post("/auth", async function(req, res) {
  const usersService = new Users();

  let errors = [];
  let email = req.body.email;
  let password = req.body.password;
  if (!email) {
    errors.push({
      field: "email",
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

  const result = await usersService.authenticate(email, password);
  if (result.success) {
    res.send(result);
    return;
  }
  res.status(400).send(result);
});

users.use(authentication);

// AUTHENTICATED ROUTES

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
