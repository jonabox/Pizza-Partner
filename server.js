"use strict";

const express = require('express');
const path = require('path');
// const logger = require('morgan');
// const session = require('express-session');
// const uuid = require('uuid/v4');

const indexRouter = require('./routes/index');
const dominosRouter = require('./routes/dominos');
// const usersRouter = require('./routes/users');
// const sessionRouter = require('./routes/session');

const app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
// app.use(session({ 
//     secret: 'secret secret, tell no one',
//     saveUninitialized: false,
//     resave: false,
//     genid: () => {
//         return uuid(); //use uuid's for session id
//     }
// }));

app.use('/', indexRouter);
app.use('/api',indexRouter);
app.use('/api/dominos', dominosRouter);
// app.use('/api/users', usersRouter);
// app.use('/api/session', sessionRouter);

module.exports = app;