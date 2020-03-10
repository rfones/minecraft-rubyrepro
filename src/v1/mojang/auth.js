const express = require('express')
const auth = express.Router();
const axios = require('axios')

const AUTH_SERVER = 'https://authserver.mojang.com/'
const CLIENT_UUID = '82bb8f42-1c46-4460-940b-8bd5821c48e1'

auth.post('/login', function (req, res) {
	console.log(req.body)
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		res.status(400).send('username and password are required');
		return;
	}

	axios.post(`${AUTH_SERVER}/authenticate`, { username, password, clientToken: CLIENT_UUID, requestUser: true })
		.then(response => {
			res.send(response.data)
		})
		.catch(error => {
			res.send(error)
		})

});

module.exports = auth



