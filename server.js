
var express = require('express');
const Session = require('./public/server/session');
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
var players = [];

var clients = 0;


function randomPiece() {
    var random = Math.floor(Math.random() * PIECES.length);
    var temp = new Tetris(PIECES[random][0], PIECES[random][1]);

    return temp;
}


function Player(id, tetris) {
    this.tetromino = tetris.tetromino;
    this.direction = 0;

    this.activeTetromino = this.tetromino[this.direction];

    this.color = tetris.color;
    this.id = id;

    this.x = 3;
    this.y = -1;
}

io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {
        console.log("connect");
        socket.on('start',
        function(data) {
            console.log("PLAYER RECEIVED");    
            var player = new Player(data.id, data.tetro);
            players.push(player);
            console.log(player.id);       
            }
        );

        ++clients;
        // var client = {
        //     count: clients,
        //     id: id,
        // }
        // socket.emit('users_count', client);
        // console.log("clients: ", clients);

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
                // console.log("UPDATE");
            }
        );

        socket.on('disconnect', function () {
            console.log("Client has disconnected");
            clients--;
        });
    }
);