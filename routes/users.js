const express = require('express');
const router = express.Router();

const Users = require('../models/Users');

/**
 * Create user.
 * POST/api/users/:username
 * :username is username to be created
 * @throws {400} - if username already exists
 */
router.post('/:username', async (req, res) => {
    let username = req.params.username;
    let password = req.body.password;
    const user = await Users.findUser(username);

    // check if user in db
    if (user[0]) {
        res.status(400).json({
            error: `Username already registered`,
          }).end();
    }

    else {
        await Users.createUser(username, password);
        res.send(`Account ${username} create. Please sign in.`)
    }
});

 /**
 * Updates user favorite order that is signed in.
 * @username PUT/api/users/:username
 * :username is username to be deleted
 * @throws {401} - if client is not signed in
 */
router.put('/changePassword', async (req, res) => {
    // let username = req.session.user;
    let username = req.body.username;
    const user = await Users.findUser(username);
    let newFavorite = req.body.favorite;
    if (username) {
        await Users.changeFavorite(username, newFavorite);
        res.send(`${username}'s favorite order has been updated`)
    }
    // else {
    //     res.status(403).json({error: "Must be logged in to change password", }).end();
    // }
});

module.exports = router;