const axios = require("axios");

const AUTH_SERVER = "https://authserver.mojang.com";
const CLIENT_UUID = "82bb8f42-1c46-4460-940b-8bd5821c48e1";

class auth {
  authenticate(username, password) {
    return axios.post(`${AUTH_SERVER}/authenticate`, {
      username,
      password,
      clientToken: CLIENT_UUID,
      requestUser: true
    });
  }
}

module.exports = auth;
