#!/usr/bin/env node

/**
 * Module dependencies.
 */
const app = require('../server');
const fs = require('fs');
const debug = require('debug')('pizza-partner:server');
const http = require('http');
const https = require('https');

var isDebug = true;

const database = require('../database');
/**
 * Create database and tables.
 */
database.createTables();

if(!isDebug){
  // Certificate
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/jonabox.com/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/jonabox.com/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/jonabox.com/chain.pem', 'utf8');

  const credentials = {
		key: privateKey,
			cert: certificate,
		ca: ca
  };
}
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */
if(isDebug){const server = http.createServer(app);}
else{const server = https.createServer(credentials, app);}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}


/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
