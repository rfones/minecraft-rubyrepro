const fs = require("fs");
const path = require("path");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const userfile = "../json/users.json";

class users {
  constructor() {
    this.users = JSON.parse(fs.readFileSync(path.resolve(__dirname, userfile)));
  }

  async authenticate(username, password) {
    const user = this.users.find(user => user.username === username);
    if (!user) {
      return { message: "User not found!" };
    }

    if (await argon2.verify(user.hashedPassword, password)) {
      var privateKey = fs.readFileSync(
        path.resolve(process.env.JWT_PRIVATE_PEM)
      );
      delete user.hashedPassword;
      var accessToken = jwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: user },
        privateKey,
        { algorithm: "RS256" }
      );
      return { success: true, accessToken };
    }

    return { message: "Authentication failed!" };
  }

  async registerUser({ username, password, name }) {
    const user = this.users.find(user => user.username === username);
    if (user) {
      return { message: "User already exists!" };
    }

    const id = uuidv4();
    const hashedPassword = await argon2.hash(password);

    this.users.push({ id, name, username, hashedPassword });

    this.saveUserFile();
    return { success: true };
  }

  saveUserFile() {
    console.log("saving users...", this.users);
    fs.writeFileSync(
      path.resolve(__dirname, userfile),
      JSON.stringify(this.users, null, 2)
    );
  }

  update(data) {
    const userIndex = this.users.findIndex(user => user.id === data.id);
    if (userIndex === -1) {
      return { message: "User not found!" };
    }
    this.users[userIndex] = { ...this.users[userIndex], ...data };
    this.saveUserFile();
    return { success: true };
  }
}

module.exports = users;
