const express = require('express');
const router = express.Router();

const Users = require('../models/User');

/**
 * signs in user.
 * @username GET/api/users/:username
 * :username is username to be deleted
 * @throws {403} - if client put wrong credentials
 * @throws {404} - if user not found
 */
router.put('/:username', async (req, res) => {
    let username = req.params.username;
    let inputPassword = req.body.password;
    const getUser = await Users.findUser(username);
    let user = getUser[0];
    if (!user) {
        res.status(404).json({error: "account with username not found", }).end();
    }
    else if (inputPassword !== user.password) {
        res.status(403).json({error: "username or password is incorrect", }).end();
    }
    else {
        // req.session.user = username;
        console.log(`${username} is signed in`);
        res.json({ message: `Welcome, ${username}!`, username: username, cart: user.favorite})
    }
});

/**
 * Create user.
 * POST/api/users/:username
 * :username is username to be created
 * @throws {400} - if username already exists
 */
router.post('/:username', async (req, res) => {
    let username = req.params.username;
    let password = req.body.password;
    const getUser = await Users.findUser(username);
    let user = getUser[0];

    // check if user in db
    if (user) {
        res.status(400).json({
            error: `username already registered`,
          }).end();
    }

    else {
        await Users.createUser(username, password);
        console.log("username: " + username + " created")
        res.json({ message: `account ${username} created!`, username: username})
    }
});

 /**
 * get user favorite order that is signed in.
 * @username GET/api/users/changeFavorite
 * :username is username to be deleted
 * @throws {401} - if client is not signed in
 */
router.get('/:username/favorite', async (req, res) => {
    // let username = req.session.user;
    let username = req.params.username;
    const getUser = await Users.findUser(username);
    let user = getUser[0];
    console.log(user);
    if (user) {
        res.send(user.favorite);
    }
    else {
        res.status(403).json({error: "rrror updating favorite order", }).end();
    }
});

 /**
 * Updates user favorite order that is signed in.
 * @username PUT/api/users/changeFavorite
 * :username is username to be deleted
 * @throws {401} - if client is not signed in
 */
router.put('/:username/favorite', async (req, res) => {
    // let username = req.session.user;
    let username = req.params.username;
    const user = await Users.findUser(username);
    let newFavorite = req.body.cart;
    if (user) {
        await Users.changeFavorite(username, newFavorite);
        res.json({ message: `${username}'s favorite order has been updated!`})
    }
    else {
        res.status(403).json({error: "error updating favorite order", }).end();
    }
});

module.exports = router;