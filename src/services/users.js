const fs = require("fs");
const path = require("path");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const usersfile = "../json/users.json";

class users {
  constructor(token) {
    try {
      this.users = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, usersfile))
      );
    } catch (error) {
      if (error.code === "ENOENT") {
        // if file doesn't exist, create empty array
        this.users = [];
      } else {
        throw err;
      }
    }
  }

  async authenticate(email, password) {
    const user = this.users.find(user => user.email === email);
    if (!user) {
      return { message: "User not found!" };
    }

    if (await argon2.verify(user.hashedPassword, password)) {
      var privateKey = fs.readFileSync(
        path.resolve(process.env.JWT_PRIVATE_PEM)
      );

      // remove hashed password from user returned with token
      let tokenUser = { ...user };
      delete tokenUser.hashedPassword;

      var accessToken = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: tokenUser
        },
        privateKey,
        { algorithm: "RS256" }
      );

      // update login info on user
      this.update({
        id: user.id,
        loginCount: user.loginCount + 1 || 1,
        lastLogin: new Date()
      });

      return { success: true, accessToken };
    }

    return { message: "Authentication failed!" };
  }

  async registerUser({ email, password, name }) {
    const user = this.users.find(user => user.email === email);
    if (user) {
      return { message: "User already exists!" };
    }

    const hashedPassword = await argon2.hash(password);

    this.users.push({
      id: uuidv4(),
      name,
      email,
      hashedPassword,
      created: new Date()
    });

    this.saveUsersFile();
    return { success: true };
  }

  saveUsersFile() {
    fs.writeFileSync(
      path.resolve(__dirname, usersfile),
      JSON.stringify(this.users, null, 2),
      { flag: "w" }
    );
  }

  update(data) {
    const userIndex = this.users.findIndex(user => user.id === data.id);
    if (userIndex === -1) {
      return { message: "User not found!" };
    }
    this.users[userIndex] = { ...this.users[userIndex], ...data };
    this.saveUsersFile();
    return { success: true };
  }
}

module.exports = users;
