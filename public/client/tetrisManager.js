class TetrisManager {
    constructor(document) {
        this.document = document;
        this.template = this.document.querySelector('#player_template');
        this.instances =[];
    }   
}

class Tetris {
    
    Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.direction = 0;

    this.activeTetromino = this.tetromino[this.direction];

    this.color = color;

    this.x = 3;
    this.y = -1;
    }

    fill(color) {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                // we draw only occupied squares
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }

    sideFill(canvas, color) {
        let length = p.activeTetromino.length;
        length = 6 - length;
        let start = length - 1;
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                // we draw only occupied squares
                if (this.activeTetromino[r][c]) {
                    drawPiece(canvas, c + start, r + start, color);
                }
            }
        }
    }

    draw() {
        this.fill(this.color);
    }


    unDraw() {
        this.fill(VACANT);
    }

    drawSide(canvas) {
        this.sideFill(canvas, this.color);
    }

    current.drawSide(panel);

    moveDown() {

        if (!this.collision(0, 1, this.activeTetromino)) {
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


    moveLeft() {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }

    moveRight() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }


    FastDown() {

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

    collision(x, y, piece) {
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



    rotate() {
        console.log("p rotated2");
        var temp = this.tetromino[(this.direction + 1) % this.tetromino.length];
        var offset = 0;
        if (this.collision(0, 0, temp)) {
            if (this.x > COLS / 2) {
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

    lock() {

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

    pieceSaved() {

        if (saved == 0) {
            p.unDraw();
            p.drawSide(stack);
            console.log("noUnDraw");
            saved = p;
            p = randomPiece();
            p.draw();
        } else if (saved) {
            p.unDraw();
            drawSideBar(stack);
            p.drawSide(stack);
            var temp = p;
            p = saved;
            saved = temp;
            p.draw();
        }

    }

}