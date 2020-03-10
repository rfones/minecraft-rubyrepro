var express = require('express')
var mojang = express.Router()

var auth = require('./auth');

mojang.use('/auth', auth);

mojang.get('/', function (req, res) {
  res.send('Mojang home page')
})
// define the about route
mojang.get('/login', function (req, res) {
  res.send('About mojang')
})

module.exports = mojang
