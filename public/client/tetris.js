
const canvas = document.getElementById('tetris');
const sidebar = document.getElementById('side');
const save = document.getElementById('saved');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');

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

// var socket = io.connect('http://ptetris.herokuapp.com');

// socket.on('news', function (data) {
//     console.log(data);
//     socket.emit('my other event', { my: 'data' });
// });


var Board = [];
for ( row = 0; row < ROWS; row++ ) {
    Board[row] =[];
    for ( col = 0; col < COLS; col++ ) {
        Board[row][col] = VACANT;
    }
}

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


function drawBoard() {
    for ( row = 0; row < ROWS; row++) {
        for ( col = 0; col < COLS; col++) {
            drawSquare( col, row, Board[row][col] );
        }
    }
}

drawBoard();
drawSideBar(panel);
drawSideBar(stack);


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
    var random = Math.floor( Math.random() * PIECES.length );
    return new Piece(PIECES[random][0], PIECES[random][1]  );
}

var p = randomPiece();
var saved = 0;
var current = p;


function Piece ( tetromino, color ) {
    this.tetromino= tetromino;
    this.direction = 0;
    
    this.activeTetromino = this.tetromino[this.direction];
    
    this.color = color;

    this.x = 3;
    this.y = -1;
}

Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // we draw only occupied squares
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Piece.prototype.sideFill = function ( canvas, color) {
    let length = p.activeTetromino.length;
    length = 6 - length;
    let start = length - 1;
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // we draw only occupied squares
            if (this.activeTetromino[r][c]) {
                drawPiece(canvas, c+start, r+start, color);
            }
        }
    }
}

Piece.prototype.draw = function() {
    this.fill( this.color );
}


Piece.prototype.unDraw = function() {
    this.fill( VACANT );
}

Piece.prototype.drawSide = function( canvas ) {
    this.sideFill( canvas, this.color );
}

current.drawSide(panel);

Piece.prototype.moveDown = function() {
    
    if ( !this.collision( 0,1, this.activeTetromino ))  {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
        current = p;
        current.drawSide(panel);
        
    }
}


Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    } 
}

Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}


Piece.prototype.FastDown = function () {

    this.unDraw();
    while (!this.collision(0, 1, this.activeTetromino)) {      
        this.y++;
    }
    this.draw();
    this.lock();
    p = randomPiece();
    current = p;  
    current.drawSide(panel);
    
}

Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            // if the square is empty, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions
            if (newX < 0 || newX >= COLS || newY >= ROWS) {
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if (newY < 0) {
                continue;
            }
            // check if there is a locked piece alrady in place
            if (Board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}



Piece.prototype.rotate = function() {
    console.log("p rotated2");
    var temp = this.tetromino[(this.direction + 1) % this.tetromino.length] ;
    var offset = 0;
    if (this.collision(0, 0, temp)) {
        if (this.x > COLS/2) {
            offset = -1;
        } else {
            offset = 1;
        }
    } 
    if (!this.collision(offset, 0, temp)) {
        this.unDraw();
        this.x += offset;
        this.direction = (this.direction + 1) % this.tetromino.length;
        this.activeTetromino = temp;
        this.draw();
    }

}

Piece.prototype.lock = function() {

    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // we skip the vacant squares
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            // pieces to lock on top = game over
            if (this.y + r < 0) {
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            
            Board[this.y + r][this.x + c] = this.color;
        }
    }
    // remove full rows
    for (r = 0; r < ROWS; r++) {
        let isRowFull = true;
        for (c = 0; c < COLS; c++) {
            isRowFull = isRowFull && (Board[r][c] != VACANT);
        }
        if (isRowFull) {
            // if the row is full
            // we move down all the rows above it
            for (y = r; y > 1; y--) {
                for (c = 0; c < COLS; c++) {
                    Board[y][c] = Board[y - 1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for (c = 0; c < COLS; c++) {
                Board[0][c] = VACANT;
            }
            score += 100;
        }
    }
    // update the board
    drawBoard();
    drawSideBar(panel);
    
    scoreElement.innerHTML = score;
}

Piece.prototype.pieceSaved = function() {

    if ( saved == 0 ) {
        p.unDraw();
        p.drawSide( stack );
        console.log("noUnDraw");
        saved = p;
        p = randomPiece();
        p.draw();
    } else if ( saved ) {
        p.unDraw();
        drawSideBar(stack);
        p.drawSide(stack);
        var temp = p;
        p = saved;
        saved = temp;
        p.draw();
    }
    
}


document.addEventListener("keydown", CONTROL);
var KeyPressed = {
    left: 37, up: 38, right: 39, down: 40,
    space: 32, shift: 16
};
function CONTROL(event) {
    if (event.keyCode == KeyPressed.right) {
        p.moveRight();
        dropStart = Date.now();
    }
    else if (event.keyCode == KeyPressed.left) {
        p.moveLeft();
        dropStart = Date.now();
    }
    else if (event.keyCode == KeyPressed.down) {
        p.moveDown();
        
    }
    else if (event.keyCode == KeyPressed.up) {
        p.rotate();
        dropStart = Date.now();
    }
    else if (event.keyCode == KeyPressed.space) {
        p.FastDown();
    }
    else if (event.keyCode == KeyPressed.shift) {
        p.pieceSaved();
        console.log("piecedSaved");
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
        
        p.moveDown();
        score += 10;
        scoreElement.innerHTML = score;
        dropStart = Date.now();
    }if (!gameOver) {

        requestAnimationFrame(update);
        
    }
    
}
update();
