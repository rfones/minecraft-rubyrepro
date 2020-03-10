var express = require("express");
var app = express();

var api = require("./src/api");

app.use(express.json());

app.use("/api", api);

app.get("/", function(req, res) {
  res.send("minecraft.rubyrepro.com");
});
// app.listen(8080, '192.168.1.130');
app.listen(8080);
