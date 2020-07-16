#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const http = require('http');
let log = require('debug-logger')('triviapp');
const socket = require('./../config/socket.js');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    log.info("www.js -> normalizePort");
    const port = parseInt(val, 10);

  if (isNaN(port)) {
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
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    log.info("www.js -> onError");
  if (error.syscall !== 'listen') {
      log.error("Error.syscall !== listen!");
      log.error("Error trace: ", error);
    throw error;
  }

    const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
        log.error(bind + " requires elevated privileges!");
        log.error("Error trace: ", error);
      process.exit(1);
      break;
    case 'EADDRINUSE':
        log.error(bind + " is already in use!");
        log.error("Error trace: ", error);
      process.exit(1);
      break;
    default:
        log.error("Default error!");
        log.error("Error trace: ", error);
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    log.info("www.js -> onListening");
    const addr = server.address();
    const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    log.debug("Listening on: ", bind);
}

/** Socket io **/
socket.init(server);