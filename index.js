require("dotenv").config();
const express = require("express");
const path = require("path");
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

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/api", api);

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// app.listen(8080, '192.168.1.130');
app.listen(8080);
