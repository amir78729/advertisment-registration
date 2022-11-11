const http = require('http');
const subscribeFromQueue = require('../services/ampq/subscriber');

const host = 'localhost';
const port = 3002;

const requestListener = function (req, res) {
  subscribeFromQueue();
  res.writeHead(200);
  res.end('');
};

const serverB = http.createServer(requestListener);

module.exports = {
  core: serverB,
  name: 'ServerB',
  port
};