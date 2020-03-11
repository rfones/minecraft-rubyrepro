const fs = require("fs");

class users {
  whitelist;
  ops;
  users;
  constructor() {
    this.whitelist = fs.readFileSync(process.env.WHITELIST_JSON);
    this.ops = fs.readFileSync(process.env.OPS_JSON);
    this.users = [...this.whitelist, ...this.ops];
  }

  getAll() {
    return JSON.parse(this.users);
  }

  save(user) {
    let whitelistUser = this.whitelist.filter(
      whitelistUser => whitelistUser.uuid === user.uuid
    );
    let opsUser = this.ops.filter(opsUser => opsUser.uuid === user.uuid);
    try {
      if (user.level && user.level > 0) {
        if (opsUser) {
          opsUser = user;
        } else {
          this.ops.push(user);
        }
        fs.writeFileSync(
          process.env.OPS_JSON,
          JSON.stringify(this.ops, null, 2)
        );

        // remove from whitelist
        if (whitelistUser) {
          this.whitelist = this.whitelist.filter(
            whitelistUser => whitelistUser.uuid !== user.uuid
          );
          fs.writeFileSync(
            process.env.WHITELIST_JSON,
            JSON.stringify(this.whitelist, null, 2)
          );
        }
      } else {
        if (whitelistUser) {
          whitelistUser = user;
        } else {
          this.whitelist.push(user);
        }
        fs.writeFileSync(
          process.env.WHITELIST_JSON,
          JSON.stringify(this.ops, null, 2)
        );

        // remove from ops
        if (opsUser) {
          this.ops = this.ops.filter(opsUser => opsUser.uuid !== user.uuid);
          fs.writeFileSync(
            process.env.OPS_JSON,
            JSON.stringify(this.ops, null, 2)
          );
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  }

}

module.exports = users;
