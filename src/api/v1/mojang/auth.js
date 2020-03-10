const express = require("express");
const auth = express.Router();

const mojangAuth = require("../../../services/mojang/auth");

auth.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).send("username and password are required");
    return;
  }

  const authService = new mojangAuth();
  authService
    .authenticate(username, password)
    .then(response => {
      req.session.accessToken = response.data.accessToken;
      res.json({ success: true });
    })
    .catch(error => {
      res.status(403).send(error);
    });
});

module.exports = auth;
