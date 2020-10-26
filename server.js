// Imports
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;
const cors = require('cors');

// Instantiate server
const server = express();

// Body parser configuration
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());

// Configuration route
server.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<h1>Coucou :p</h1>')
});

server.use('/api/', apiRouter);

server.listen(8080, function () {
  console.log('Serveur en écoute')
});