const axios = require("axios");

class auth {
  AUTH_SERVER = "https://authserver.mojang.com";
  CLIENT_UUID = "82bb8f42-1c46-4460-940b-8bd5821c48e1";

  authenticate(username, password) {
    return axios.post(`${this.AUTH_SERVER}/authenticate`, {
      username,
      password,
      clientToken: this.CLIENT_UUID,
      requestUser: true
    });
  }

  refresh(accessToken, id, name) {
    return axios.post(`${this.AUTH_SERVER}/refresh`, {
      accessToken,
      clientToken: this.CLIENT_UUID,
      selectedProfile: {
        id: id,
        name: name
      },
      requestUser: true
    });
  }

  invalidate(accessToken) {
    return axios.post(`${this.AUTH_SERVER}/invalidate`, {
      accessToken,
      clientToken: this.CLIENT_UUID
    });
  }
}

module.exports = auth;
