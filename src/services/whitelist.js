const fs = require("fs");

class whitelist {
  rawdata;
  constructor() {
    this.rawdata = fs.readFileSync(process.env.WHITELIST_JSON);
  }

  get() {
    return JSON.parse(this.rawdata);
  }

  _set(whitelist) {
    const data = JSON.stringify(whitelist, null, 2);
    fs.writeFileSync(process.env.WHITELIST_JSON, data);
  }

  getByUuid(uuid) {
    return this.rawdata.filter(user => {
      user.uuid === uuid;
    });
  }

  getByName(name) {
    return this.rawdata.filter(user => {
      user.name === name;
    });
  }
}

module.exports = whitelist;
