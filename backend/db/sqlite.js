const sqlite3 = require('sqlite3').verbose();

class DAO {
  constructor() {
    this.db = new sqlite3.Database("./db/content.db", sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }

      console.log("Connection Succeeded");
    });
  }

  // drop table
  dropTable() {
    console.log("Dropping table");
    this.db.run('DROP TABLE if exists HELP_ARTICLE');
  }

  createTable(sql) {
    console.log("Creating table");
    this.db.run(sql);
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve({id: params[0]});
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql);
          console.log(err);
          reject(err)
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = DAO;