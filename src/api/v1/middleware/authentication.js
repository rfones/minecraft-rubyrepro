const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const authentication = function(req, res, next) {
  var privateKey = fs.readFileSync(path.resolve(process.env.JWT_PRIVATE_PEM));
  jwt.verify(req.token, privateKey, { algorithms: ["RS256"] }, function(
    err,
    decoded
  ) {
    if (err) {
      res.status(401).send({ message: err.message });
      return;
    }
    req.user = decoded.data;
    next();
  });
};

module.exports = authentication;
