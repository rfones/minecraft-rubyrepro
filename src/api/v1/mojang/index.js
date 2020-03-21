var express = require('express')
var mojang = express.Router()

var auth = require('./auth');

const Mojang = require('../../../services/mojang');

mojang.use('/auth', auth);

mojang.get('/uuid/:username', function (req, res) {
  const mojangService = new Mojang();
  mojangService.getUuidByName(req.params.username)
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    res.send(error)
  })
})

module.exports = mojang
