const Gamedig = require("gamedig");

class server {
  getInfo() {
    return Gamedig.query({
        type: "minecraft",
        host: "minecraft.rubyrepro.com"
      })
  }
}

module.exports = server;
