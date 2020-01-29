'use strict';
const database = require('../database');

/**
 * @class Users
 * Stores all Users.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Users {
    /**
     * Add a User.
      * @param {string} username - name of user
      * @param {string} password - password of user
     */
    static async createUser(username, password) {
        try {
            const sql = `INSERT INTO user (username, password) VALUES ('${username}', '${password}');`;
            const response = await database.query(sql);
            return response;
        } catch (err) { throw err; }
    }

    /**
     * Find a User by Username.
     * @param {string} Username - Username of User to find
     * @return {User | undefined} - found User
     */
    static async findUser(username) {
        try {
            const sql = `SELECT * FROM user WHERE username = '${username}';`;
            const response = await database.query(sql);
            return response;
        } catch (err) { throw err; }
    }

    /**
     * checks if a user is in the user table
     * @param {string} Username - Username of User
     */
    static async checkUser(username) {
        try {
            const sql = `SELECT COUNT(*) AS count FROM user WHERE username = '${username}';`;
            const response = await database.query(sql);
            return response;
        } catch (err) { throw err; }
    }

    /**
   * Change favorite order of user.
   * @param {string} Username - Username of User to update
   * @param {string} favorite - favorite order
   * @return {User | undefined} - updated User; undefined if user not found
   */
  static async changeFavorite(username, newFavorite) {
    try {
      let favoriteString = JSON.stringify(newFavorite).replace("'", "''");
      console.log(favoriteString);
      const sql = `UPDATE user SET favorite = '${favoriteString}' WHERE username = '${username}';`
      const response = await database.query(sql);
      return response;
    } catch (err) { throw err; }
  }
}

module.exports = Users;