
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const SQ = 20;
const VACANT = '#dcdde1';

var gameOver = false;
var KO = false;
var dropStart = Date.now();


var Board = [];
for ( row = 0; row < ROWS; row++ ) {
    Board[row] =[];
    for ( col = 0; col < COLS; col++ ) {
        Board[row][col] = VACANT;
    }
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

drawBoard( Board );

const PIECES = [
    [Z, '#fa983a' ],
    [T, '#3c6382' ],
    [I, '#e55039' ],
    [J, '#38ada9' ],
    [S, '#b8e994' ],
    [L, '#e84393' ],
    [O, '#a29bfe' ],
];

function randomPiece() {
    var random = Math.floor( Math.random() * PIECES.length );
    return new Piece(PIECES[random][0], PIECES[random][1]  );
}

var p = new Piece(PIECES[1][0], PIECES[1][1]);

function Piece ( tetromino, color ) {
    this.tetromino= tetromino;
    this.direction = 0;
    this.activeTetromino = this.tetromino[this.direction];
    this.color = color;

    this.x = 3;
    this.y = 5;
}


Piece.prototype.fill = function( color ) {
    this.activeTetromino.forEach((row) => {
        row.forEach((col) => {
            if ( this.activeTetromino[row][col] ) {
                drawSquare( this.x + col, this.y + row, color );
            }
        });
    });    
}

Piece.prototype.draw = function() {
    this.fill( this.color );
}

p.draw();

Piece.prototype.unDraw = function() {
    this.fill( VACANT );
}

Piece.prototype.moveDown = function() {
    if ( !this.collision( 0,1, this.activeTetromino )) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        randomPiece();
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

    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
}

Piece.prototype.collision = function( x, y, piece ) {
    piece.forEach((row) => {
        row.forEach((col) => {
            if (!piece[row][col]) { continue; }

            newX = this.x + col + x;
            newY = this.y + row + y;

            if ( newX < 0 || newX >= COLS || newY >= ROWS ) { return true; }
            if ( newY < 0 ) { continue; }
            if ( Board[newY][newX] != VACANT ) { return true; }
            
        });
    }); 

    return false; 
}

Piece.prototype.rotate = function() {
    var temp = this.tetromino[(this.direction + 1) % this.tetromino.length] ;
    var offset = 0;
    if (this.collision(0, 0, this.activeTetromino)) {
        if (this.x > COLS/2) {
            offset = -1;
        } else {
            offset = 1;
        }
    } 

    if (this.collision(offset, 0, this.activeTetromino)) {
        this.unDraw();
        this.x += offset;
        this.direction = (this.direction + 1) % this.tetromino.length;
        this.activeTetromino = temp;
        this.draw();
    }

}

Piece.prototype.lock = function() {

    Board.forEach((row) => {
        row.forEach((col) => {
            if (!this.activeTetromino[row][col]) {
                continue;
            }
            if ( this.y + r < 0 ) {
                KO = true; 
                break;            
            }
            Board[this.y + row][this.x+col] = this.color;
        });
    });

    Board.forEach( row => {
        var fullRow = true;
        row.forEach ( col => {
            fullRow = fullRow && (Board[row][col] != VACANT)
        });
        if ( fullRow ) {
            for ( y = row; y > 1; y-- ) {
                for ( col = 0; col < COLS; col++ ) {
                    Board[y][col] = Board[y-1][col];
                }               
            }
        }
        row.forEach ( col => {
            Board[0][col] = VACANT;
        });
    });

    drawBoard();

}


document.addEventListener("keydown", CONTROL);
var KeyPressed = {
    left: 37, up: 38, right: 39, down: 40,
    space: 32
};
function CONTROL(event) {
    if (event.keyCode == KeyPressed.right) {
        p.moveRight();
    }
    else if (event.keyCode == KeyPressed.left) {
        p.moveRight();
    }
    else if (event.keyCode == KeyPressed.down) {
        p.moveDown();
        dropStart = Date.now();
    }
    else if (event.keyCode == KeyPressed.up) {
        p.rotate();
    }
    else if (event.keyCode == KeyPressed.space) {
        p.FastDown();
    }


}

function drop() {

    var now = Date.now();
    var delta = now - dropStart;

    if ( delta > 1000 ) {
        piece.moveDown;
        dropStart = Date.now();
    }
    if ( !gameOver ) {
        requestAnimationFrame(drop);
    }

}

drop();

