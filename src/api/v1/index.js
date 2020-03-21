const express = require("express");
const v1 = express.Router();
const authentication = require("./middleware/authentication");

const server = require("./server");
const users = require("./users");
const whitelist = require("./whitelist");
const mojang = require("./mojang");

v1.use("/users", users);

v1.use(authentication);

v1.use("/server", server);
v1.use("/whitelist", whitelist);
v1.use("/mojang", mojang);

v1.get("/", function(req, res) {
  res.send("v1");
});

module.exports = v1;
