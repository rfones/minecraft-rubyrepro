const axios = require("axios");

class mojang {
  API_URL = "https://api.mojang.com";
  getUuidByName(username) {
    return axios.get(`${this.API_URL}/users/profiles/minecraft/${username}`);
  }
}

module.exports = mojang;
