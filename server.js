
var express = require('express');
const Session = require('./public/server/session');
var app = express();
var server = app.listen(process.env.PORT || 5000, listen);
console.log("server.address()", server.address());
const sessions = new Map;
// This call back just tells us that the server has started
function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public/client/'));

var io = require('socket.io')(server);

var players = [];

var clients = 0;


function createSession(id) {
    if (sessions.has(id)) {
        throw new Error(`Session ${id} already exists`);
    }

    const session = new Session(id);
    console.log('Creating session', session);

    sessions.set(id, session);

    return session;
}

function getSession(id) {
    return sessions.get(id);
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
            
            console.log("PLAYERS RECEIVED: ", clients);    
            var player = new Player(data.id, data.tetro);
            players.push(player);
            socket.emit("newPlayer", player );
            console.log(player.id);    
            if ( data.session == null || clients >= 2) {
                clients++;
                const session = createSession( player.id );
                session.join(player);
                socket.join(player.id)
                // console.log("CreatedSession: ", session);
            } else if (clients < 2) {
                clients++;
                const sessionId = data.session;
                console.log("SessionID", sessionId);
                const session = getSession( sessionId );
                console.log("JoinedSession", session);
                session.join(player);
                socket.join(sessionId)
                console.log("Player Joined");
                console.log("List of Players: ", session.clients);
                if (clients == 2) {
                    console.log("ServerSide: GameOn");
                    socket.emit("GameOn", session.clients);
                    }
                }
            }
        );

        socket.on('moveDown',
        
            function(data) {
                console.log("Data received in moveDown");
                // console.log("sessionId =", data.sessionId);
                var send = {
                    message: "let's play a game (too)",
                    piece: data.piece
                }
                socket.to(data.sessionId).emit('Down', send);
                console.log("Data emitted");
            });
        
        socket.on('moveLeft',

            function (data) {
                console.log("Data received in moveLeft");
                // console.log("sessionId =", data.sessionId);
                var send = {
                    message: "let's play a game (too)",
                    piece: data.piece
                }
                socket.to(data.sessionId).emit('Left', send);
                console.log("Data moveLeft emitted");
            });
        socket.on('moveRight',

            function (data) {
                console.log("Data received in moveRight");
                // console.log("sessionId =", data.sessionId);
                var send = {
                    message: "let's play a game (too)",
                    piece: data.piece
                }
                socket.to(data.sessionId).emit('Right', send);
                console.log("Data emitted");
            });
        socket.on('moveFastDown',

            function (data) {
                console.log("Data received in moveFastDown");
                // console.log("sessionId =", data.sessionId);
                var send = {
                    message: "let's play a game (too)",
                    piece: data.piece
                }
                socket.to(data.sessionId).emit('FastDown', send);
                console.log("Data emitted");
            });
        socket.on('moveRotate',

            function (data) {
                console.log("Data received in move");
                // console.log("sessionId =", data.sessionId);
                var send = {
                    message: "let's play a game (too)",
                    piece: data.piece
                }
                socket.to(data.sessionId).emit('Rotate', send);
                console.log("Data emitted");
            });

        socket.on('scores', 
            function(data) {
                console.log("data scores: ", data.score);
                socket.to(data.sessionId).emit('dispScores', data.score);
            });
        socket.on('gameOver',

            function (data) {
                console.log("We have a loser");
                // console.log("sessionId =", data.sessionId);
                var send = {
                    message: "You Won!",
                    id: data.loserId
                }
                socket.to(data.sessionId).emit('Winner', send);
                console.log("Data emitted");
            });




        socket.on('disconnect', function () {
            console.log("Client has disconnected");
            clients--;
        });
    }
);