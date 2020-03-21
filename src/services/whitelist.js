const fs = require("fs");

class whitelist {
  whitelist;
  ops;
  users;
  constructor() {
    this.whitelist = JSON.parse(fs.readFileSync(process.env.WHITELIST_JSON));
    this.ops = JSON.parse(fs.readFileSync(process.env.OPS_JSON));
    this.users = [...this.whitelist, ...this.ops];
  }

  getAll() {
    return this.users;
  }

  save(user) {
    return new Promise((resolve, reject) => {
      let whitelistUser = this.whitelist.findIndex(
        whitelistUser =>
          whitelistUser.uuid.replace(/-/g, "") === user.uuid.replace(/-/g, "")
      );
      let opsUser = this.ops.findIndex(
        opsUser =>
          opsUser.uuid.replace(/-/g, "") === user.uuid.replace(/-/g, "")
      );
      try {
        if (user.level && user.level >= 0) {
          if (opsUser > -1) {
            this.ops[opsUser] = user;
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
              whitelistUser =>
                whitelistUser.uuid.replace(/-/g, "") !==
                user.uuid.replace(/-/g, "")
            );
            fs.writeFileSync(
              process.env.WHITELIST_JSON,
              JSON.stringify(this.whitelist, null, 2)
            );
          }
        } else {
          if (whitelistUser > -1) {
            this.whitelist[whitelistUser] = user;
          } else {
            // strip extra props from user
            this.whitelist.push({ name: user.name, uuid: user.uuid });
          }
          fs.writeFileSync(
            process.env.WHITELIST_JSON,
            JSON.stringify(this.whitelist, null, 2)
          );

          // remove from ops
          if (opsUser) {
            this.ops = this.ops.filter(
              opsUser =>
                opsUser.uuid.replace(/-/g, "") !== user.uuid.replace(/-/g, "")
            );
            fs.writeFileSync(
              process.env.OPS_JSON,
              JSON.stringify(this.ops, null, 2)
            );
          }
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = whitelist;
