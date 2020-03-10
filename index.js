var express = require('express');
var app = express();

var v1 = require('./src/v1');

app.use(express.json())

app.use('/v1', v1);

app.get('/', function(req, res){
   res.send("minecraft.rubyrepro.com");
});
app.listen(8080, '192.168.1.130');
