const mysql = require('mysql');

const config = {
  host: 'sql.mit.edu',
  user: 'jesteban',
  password: 'greenbox4lyfe',
  database: 'jesteban+fritter',
};


class Database {
  constructor(dbConfig) {
    this.connection = mysql.createPool(dbConfig);
    // reports connection on the backend
     this.connection.connect(function(err) {
       if (err) throw err;
       console.log("Connected to database!")
     });
  }

  query(sql) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, (err, rows) => {
        if (err) { return reject(err); }
        resolve(rows);
      });
    });
  }

  // Helper function to close a connection to the database.
  // The connection also closes when the program stops running.
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) { return reject( err ); }
        resolve();
      });
    });
  }

  async createTables() {
    await this.query(`CREATE TABLE IF NOT EXISTS user(
        username VARCHAR(144) PRIMARY KEY,
        password VARCHAR(144) NOT NULL
        favorite TEXT
      );`
    ).catch(err => console.log(err));
  }
}

const database = new Database(config);

module.exports = database;