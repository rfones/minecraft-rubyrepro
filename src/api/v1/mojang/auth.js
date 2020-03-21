const express = require("express");
const auth = express.Router();

const mojangAuth = require("../../../services/mojang/auth");

auth.post("/", function(req, res) {
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
      const accessToken = response.data.accessToken;
      const user = response.data.selectedProfile;
      res.json({ success: true, accessToken, user });
    })
    .catch(error => {
      res.status(403).send({message: "Authentication failed!"});
    });
});

auth.post("/validate", function(req, res) {
  const accessToken = req.body.accessToken;

  if (!accessToken) {
    res.status(400).send("accessToken is required");
    return;
  }

  const authService = new mojangAuth();
  authService
    .validate(accessToken)
    .then(response => {
      console.log(response.data);
      res.json({ success: true });
    })
    .catch(error => {
      res.status(403).send(error);
    });
})

module.exports = auth;
