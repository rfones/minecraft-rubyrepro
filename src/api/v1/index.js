var express = require("express");
var v1 = express.Router();

var server = require("./server");
var users = require("./users");
var whitelist = require("./whitelist");
var mojang = require("./mojang");

v1.use("/server", server);
v1.use("/users", users);
v1.use("/whitelist", whitelist);
v1.use("/mojang", mojang);

v1.get("/", function(req, res) {
  res.send("v1");
});

module.exports = v1;
