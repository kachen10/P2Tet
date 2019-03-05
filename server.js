
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000, listen);
console.log("server.address()", server.address());

// This call back just tells us that the server has started
function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public/client/'));

var io = require('socket.io')(server);

var newPlayeriD;

var clients = 0;

function createId(len = 6, chars = 'abcdefghjkmnopqrstvwxyz01234567890') {
    let id = '';
    while (len--) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {
        console.log("connect");
        var id = createId();
        console.log("We have a new client: " + id);
        
       
        ++clients;
        var client = {
            count: clients,
            id: id,
        }
        socket.emit('users_count', client);
        console.log("clients: ", clients);

        socket.on('playerID',
            function ( data ){
                newPlayerID = data;
        });

        socket.on('update',
            function (data) {
                var serverTetris = {
                    piece : data.piece,
                    x : data.x,
                    y : data.y
                }
                socket.emit('draw', serverTetris);
                console.log("UPDATE");
            }
        );



        socket.on('disconnect', function () {
            console.log("Client has disconnected");
            clients--;
        });
    }
);