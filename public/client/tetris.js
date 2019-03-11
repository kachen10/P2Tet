
const canvas = document.getElementById('tetris');
const sidebar = document.getElementById('side');
const save = document.getElementById('saved');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');

const newPlayer = document.getElementById('tetris2');
const Arena = newPlayer.getContext('2d');

const context = canvas.getContext('2d');
const panel = sidebar.getContext('2d');
const stack = save.getContext('2d');


const ROWS = 20;
const COLS = 10;
const SQ = 20;
const VACANT = '#dcdde1';


var KO = false;
var score = 0;
var time = 0;
var newPiece = null;
var multiplayer = false; 
var playerID;
var p;
var saved = 0;
var current = p;

function createId(len = 6, chars = 'abcdefghjkmnopqrstvwxyz01234567890') {
    let id = '';
    while (len--) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

const PIECES = [
    [Z, '#fa983a' ],
    [T, '#3c6382' ],
    [I, '#e55039' ],
    [J, '#38ada9' ],
    [S, '#44bd32' ],
    [L, '#e84393' ],
    [O, '#a29bfe' ]
];

function randomPiece() {
    var random = Math.floor(Math.random() * PIECES.length);
    var temp = new Tetris(PIECES[random][0], PIECES[random][1]);

    return temp;
}

function getSessionId() {
    const id = window.location.hash.split('#')[1];
    return id;
}

var address = 'http://localhost:5000';
var sessionId = null;
// var socket = io.connect('http://ptetris.herokuapp.com');
if (window.location.hash) {
    console.log("window check");
    sessionId = getSessionId();
    address += "/#" + sessionId;
    console.log("Address: ", address);  
}
var socket = io.connect(address);
console.log("NEW PLAYER");
var idPlayer = createId()
var client_data = {
    id: idPlayer,
    tetro:randomPiece(idPlayer),
    session:sessionId
}
if (!window.location.hash) { window.location.hash = client_data.id; }

socket.emit("start", client_data);


var Board = new board();
var player = new TetrisManager(document);



var currentPiece = [];
for (row = 0; row < 6; row++) {
    currentPiece[row] = [];
    for (col = 0; col < 6; col++) {
        currentPiece[row][col] = VACANT;
    }
}

var savedPiece = [];
for (row = 0; row < 6; row++) {
    savedPiece[row] = [];
    for (col = 0; col < 6; col++) {
        savedPiece[row][col] = VACANT;
    }
}

function drawSideBar( canvas ) {

    for (row = 0; row < 6; row++) {
        for (col = 0; col < 6; col++) {
            drawPiece(canvas, col, row, currentPiece[row][col]);
        }
    }
}

function drawPiece(canvas, x, y, color) {

    canvas.fillStyle = color;
    canvas.fillRect(x * SQ, y * SQ, SQ, SQ);

    canvas.strokeStyle = 'WHITE';
    canvas.strokeRect(x * SQ, y * SQ, SQ, SQ);
}


function drawSquare( x, y, color ) {
    
    context.fillStyle = color;
    context.fillRect(x * SQ, y * SQ, SQ, SQ);
    
    context.strokeStyle = 'WHITE';
    context.strokeRect(x*SQ, y*SQ, SQ, SQ);
}


function drawBoard( Board ) {
    for ( row = 0; row < ROWS; row++) {
        for ( col = 0; col < COLS; col++) {
            drawSquare( col, row, Board.board[row][col] );
        }
    }
}

function drawBoardTemp(canvas, Board) {
    for (row = 0; row < ROWS; row++) {
        for (col = 0; col < COLS; col++) {
            drawPiece(canvas, col, row, Board.board[row][col]);
        }
    }
}

drawBoard( Board );
socket.on('GameOn',
    function (data) {

        console.log("GAMEON");
        multiplayer = true;
    }
);

if (multiplayer == true) {
    sessionId = getSessionId();
    console.log("Draw");
}
drawBoardTemp(Arena, new board());   
drawSideBar(panel);
drawSideBar(stack);


// var p = randomPiece();
socket.on('newPlayer',
    function (data) {
        p = new Tetris(data.tetromino, data.color);
        saved = 0;
        current = p;
        current.drawSide(panel); 
    });




document.addEventListener("keydown", CONTROL);
var KeyPressed = {
    left: 37, up: 38, right: 39, down: 40,
    space: 32, shift: 16
};
function CONTROL(event) {
    if (event.keyCode == KeyPressed.right) {
        p.moveRight();
        socket.on('nice game', function (data) {
            console.log("in GAME, recieved: ", data);
            newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
            // newPiece = data.piece;
            newPiece.x = data.piece.x;
            newPiece.y = data.piece.y;
            // serverDraw(newPiece);
            newPiece.moveRightTest();
        });
        sessionId = getSessionId();
        var moveData = {
            piece: p,
            sessionId: sessionId
        }
        socket.emit("move", moveData);
        
        dropStart = Date.now();
    }
    else if (event.keyCode == KeyPressed.left) {
        p.moveLeft();
        
        sessionId = getSessionId();
        var moveData = {
            piece: p,
            sessionId: sessionId
        }
        socket.emit("moveLeft", moveData);
        dropStart = Date.now();
        socket.on('Left', function (data) {
            console.log("in GAME, recieved: ", data);
            newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
            // newPiece = data.piece;
            newPiece.x = data.piece.x;
            newPiece.y = data.piece.y;
            // serverDraw(newPiece);
            newPiece.moveLeftTest();
        });
    }
    else if (event.keyCode == KeyPressed.down) {
        p.moveDown();
        socket.on('Down', function (data) {
            console.log("in GAME, recieved: ", data);
            newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
            // newPiece = data.piece;
            newPiece.x = data.piece.x;
            newPiece.y = data.piece.y;
            // serverDraw(newPiece);
            newPiece.moveDownTest();
        });
        sessionId = getSessionId();
        var moveData = {
            piece: p,
            sessionId: sessionId
        }
        socket.emit("moveDown", moveData);
        
    }
    else if (event.keyCode == KeyPressed.up) {
        p.rotate();
        socket.on('Rotate', function (data) {
            console.log("in GAME, recieved: ", data);
            newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
            // newPiece = data.piece;
            newPiece.x = data.piece.x;
            newPiece.y = data.piece.y;
            // serverDraw(newPiece);
            newPiece.rotateTest();
        });
        sessionId = getSessionId();
        var moveData = {
            piece: p,
            sessionId: sessionId
        }
        socket.emit("moveRotate", moveData);
        dropStart = Date.now();
    }
    else if (event.keyCode == KeyPressed.space) {
        p.FastDown();
        socket.on('FastDown', function (data) {
            console.log("in GAME, recieved: ", data);
            newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
            // newPiece = data.piece;
            newPiece.x = data.piece.x;
            newPiece.y = data.piece.y;
            // serverDraw(newPiece);
            newPiece.FastDownTest();
        });
        sessionId = getSessionId();
        var moveData = {
            piece: p,
            sessionId: sessionId
        }
        socket.emit("moveFastDown", moveData);
    }
    else if (event.keyCode == KeyPressed.shift) {
        p.pieceSaved();
    }


}


let dropStart = Date.now();

let dropInterval = 1000;
let lastTime = 0;
let gameOver = false;


function update( time = 0 ) {  

    var now = Date.now();
    var delta = now - dropStart;

    if( delta > dropInterval ){ 
        
        socket.on('Down', function(data) {
            console.log("in GAME, recieved: ", data);
            newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
            // newPiece = data.piece;
            newPiece.x = data.piece.x;
            newPiece.y = data.piece.y;
            // serverDraw(newPiece);
            newPiece.moveDownTest();
            
        });
        
        p.moveDown();
        // sending to all clients in 'game1' and/or in 'game2' room, except sender
        sessionId = getSessionId();
        var moveData = {
            piece: p,
            sessionId: sessionId
        }
        socket.emit("moveDown", moveData);

        score += 100;
        scoreElement.innerHTML = score;
        dropStart = Date.now();

    } if (!gameOver) {
        requestAnimationFrame(update);
    } 
    
}
update();
