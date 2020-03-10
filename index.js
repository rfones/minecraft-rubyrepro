const express = require("express");
const session = require("express-session");
const app = express();

app.use(
  session({
    secret: "92d403ad-c5c5-4d7e-b635-f5440c5280c1",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto" }
  })
);

const api = require("./src/api");

app.use(express.json());

app.use("/api", api);

app.get("/", function(req, res) {
  res.send("minecraft.rubyrepro.com");
});
// app.listen(8080, '192.168.1.130');
app.listen(8080);
