
const express = require('express')
const path = require('path')
var app = express();
var server = app.listen(process.env.PORT || 5000, listen);

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public/client/'));
