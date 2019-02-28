
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


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat() {
    // io.sockets.emit('heartbeat', blobs);
}



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {

        console.log("We have a new client: " + socket.id);


        socket.on('start',
            function (data) {
                console.log("start");
            }
        );

        socket.on('update',
            function (data) {
                //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
                console.log("update");
            }
        );



        socket.on('disconnect', function () {
            console.log("Client has disconnected");
        });
    }
);