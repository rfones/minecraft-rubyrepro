var express = require('express')
var v1 = express.Router()

var mojang = require('./mojang');

v1.use('/mojang', mojang);

v1.get('/', function (req, res) {
	res.send('v1')
})

module.exports = v1
