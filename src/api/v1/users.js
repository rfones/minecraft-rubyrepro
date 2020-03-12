const express = require("express");
const users = express.Router();

const Users = require("../../services/users");

users.get("/", function(req, res) {
  const usersService = new Users();
  const json = usersService.getAll();
  res.json(json);
});

users.post("/", function(req, res) {
  const usersService = new Users();
  const users = usersService.getAll();

  let errors = [];
  if (!req.body.name) {
    errors.push({
      field: "name",
      message: "is required"
    });
  }
  if (!req.body.uuid) {
    errors.push({
      field: "uuid",
      message: "is required"
    });
  }
  if (errors.length) {
    res.status(400).send({ message: "validation errors", errors });
    return;
  }

  // make sure user does not already exist
  const user = users.find(
    user => user.uuid.replace(/-/g, "") === req.body.uuid.replace(/-/g, "")
  );
  if (user) {
    res.status(400).send({ message: "user already exists" });
    return;
  }

  // insert user
  usersService
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

users.put("/", function(req, res) {});

module.exports = users;
