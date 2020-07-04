const fs = require("fs");
const path = require("path");

class players {
  whitelist;
  ops;
  players;
  constructor() {
    this.whitelist = JSON.parse(fs.readFileSync(process.env.WHITELIST_JSON));
    this.ops = JSON.parse(fs.readFileSync(process.env.OPS_JSON));
    this.players = [...this.whitelist, ...this.ops];
  }

  getAll() {
    return this.players;
  }

  save(player) {
    return new Promise((resolve, reject) => {
      let whitelistPlayer = this.whitelist.findIndex(
        whitelistPlayer =>
          whitelistPlayer.uuid.replace(/-/g, "") ===
          player.uuid.replace(/-/g, "")
      );
      let opsPlayer = this.ops.findIndex(
        opsPlayer =>
          opsPlayer.uuid.replace(/-/g, "") === player.uuid.replace(/-/g, "")
      );
      try {
        if (
          (player.level && player.level > 0) ||
          (player.level !== 0 && opsPlayer > -1)
        ) {
          if (opsPlayer > -1) {
            this.ops[opsPlayer] = { ...this.ops[opsPlayer], ...player };
          } else {
            this.ops.push({ ...this.whitelist[whitelistPlayer], ...player });
          }
          fs.writeFileSync(
            process.env.OPS_JSON,
            JSON.stringify(this.ops, null, 2)
          );

          // remove from whitelist
          // if (whitelistPlayer) {
          //   this.whitelist = this.whitelist.filter(
          //     whitelistPlayer =>
          //       whitelistPlayer.uuid.replace(/-/g, "") !==
          //       player.uuid.replace(/-/g, "")
          //   );
          //   fs.writeFileSync(
          //     process.env.WHITELIST_JSON,
          //     JSON.stringify(this.whitelist, null, 2)
          //   );
          // }
        } else {
          // remove from ops
          if (opsPlayer > -1) {
            this.ops = this.ops.filter(
              opsPlayer =>
                opsPlayer.uuid.replace(/-/g, "") !==
                player.uuid.replace(/-/g, "")
            );
            fs.writeFileSync(
              process.env.OPS_JSON,
              JSON.stringify(this.ops, null, 2)
            );
          }
        }

        if (whitelistPlayer > -1) {
          this.whitelist[whitelistPlayer] = {
            ...this.whitelist[whitelistPlayer],
            ...player
          };
        } else {
          // strip extra props from player
          this.whitelist.push({
            name: player.name || this.ops[opsPlayer].name,
            uuid: player.uuid
          });
        }
        fs.writeFileSync(
          process.env.WHITELIST_JSON,
          JSON.stringify(this.whitelist, null, 2)
        );

        resolve(player);
      } catch (error) {
        reject(error);
      }
    });
  }

  delete(uuid) {
    return new Promise((resolve, reject) => {
      let whitelistPlayer = this.whitelist.findIndex(
        whitelistPlayer =>
          whitelistPlayer.uuid.replace(/-/g, "") === uuid.replace(/-/g, "")
      );
      let opsPlayer = this.ops.findIndex(
        opsPlayer => opsPlayer.uuid.replace(/-/g, "") === uuid.replace(/-/g, "")
      );
      try {
        if (opsPlayer > -1) {
          this.ops.splice(opsPlayer, 1);
          fs.writeFileSync(
            process.env.OPS_JSON,
            JSON.stringify(this.ops, null, 2)
          );
        } else if (whitelistPlayer > -1) {
          this.whitelist.splice(whitelistPlayer, 1);
          fs.writeFileSync(
            process.env.WHITELIST_JSON,
            JSON.stringify(this.whitelist, null, 2)
          );
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  get(uuid) {
    return new Promise((resolve, reject) => {
      let whitelistPlayer = this.whitelist.find(
        whitelistPlayer =>
          whitelistPlayer.uuid.replace(/-/g, "") === uuid.replace(/-/g, "")
      );
      let opsPlayer = this.ops.find(
        opsPlayer => opsPlayer.uuid.replace(/-/g, "") === uuid.replace(/-/g, "")
      );
      if (whitelistPlayer) {
        return resolve(whitelistPlayer);
      } else if (opsPlayer) {
        return resolve(opsPlayer);
      } else {
        reject("User not found!");
      }
    });
  }

  getStats(uuid) {
    return new Promise((resolve, reject) => {
      let stats = {};
      try {
        stats = JSON.parse(
          fs.readFileSync(path.resolve(process.env.STATS_DIR, `${uuid}.json`))
        );
      } catch (error) {
        console.log("getStats", "error", error);
        if (error.code !== "ENOENT") {
          throw err;
        }
      }
      return resolve(stats);
    });
  }
}

module.exports = players;
