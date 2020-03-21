const fs = require("fs");
const path = require("path");
const argon2 = require("argon2");

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

    const hashedPassword = await argon2.hash(password);
    if (await argon2.verify(user.hashedPassword, password)) {
      return { success: true };
    }

    return { message: "Authentication failed!" };
  }

  async registerUser(username, password) {
    const user = this.users.find(user => user.username === username);
    if (user) {
      return { message: "User already exists!" };
    }

    const hashedPassword = await argon2.hash(password);
    this.users.push({ username, hashedPassword });

    this.saveUserFile();
    return { success: true };
  }

  saveUserFile() {
    fs.writeFileSync(path.resolve(__dirname, userfile), JSON.stringify(this.users, null, 2));
  }
}

module.exports = users;
