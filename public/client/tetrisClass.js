class Tetris {

    constructor(tetromino, color, id) {
        this.tetromino = tetromino;
        this.direction = 0;

        this.activeTetromino = this.tetromino[this.direction];

        this.color = color;
        this.id = id;

        this.x = 3;
        this.y = -1;
    }

    fill(color) {
        for (var r = 0; r < this.activeTetromino.length; r++) {
            for (var c = 0; c < this.activeTetromino.length; c++) {
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
        for (var r = 0; r < this.activeTetromino.length; r++) {
            for (var c = 0; c < this.activeTetromino.length; c++) {
                // we draw only occupied squares
                if (this.activeTetromino[r][c]) {
                    drawPiece(canvas, c + start, r + start, color);
                }
            }
        }
    }

    sideFill2(canvas, color) {
        
        for (var r = 0; r < this.activeTetromino.length; r++) {
            for (var c = 0; c < this.activeTetromino.length; c++) {
                // we draw only occupied squares
                if (this.activeTetromino[r][c]) {
                    drawPiece(canvas, this.x + c, this.y + r, color);
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

    drawSide2(canvas) {
        this.sideFill2(canvas, this.color);
    }

    drawSide(canvas) {
        this.sideFill(canvas, this.color);
    }

    undrawSide(canvas) {
        this.sideFill2(canvas, VACANT);
    }


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

    moveDownTest() {

        if (!this.collision(0, 1, this.activeTetromino)) {
            this.undrawSide(Arena);
            this.y++;
            this.drawSide2(Arena);
        } else {
            this.lock();
            newPiece = randomPiece();

        }
    }



    moveLeft() {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }
    moveLeftTest() {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.undrawSide(Arena);
            this.x--;
            this.drawSide2(Arena);
        }
    }

    moveRight() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }
    moveRightTest() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.undrawSide(Arena);
            this.x++;
            this.drawSide2(Arena);
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

    FastDownTest() {

        this.undrawSide(Arena);
        while (!this.collision(0, 1, this.activeTetromino)) {
            this.y++;
        }
        this.drawSide2(Arena);
        this.lock();
        newPiece = randomPiece();
    }

    collision(x, y, piece) {
        for (var r = 0; r < piece.length; r++) {
            for (var c = 0; c < piece.length; c++) {
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
                if (Board.board[newY][newX] != VACANT) {
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

    rotateTest() {
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
            this.undrawSide(Arena);
            this.x += offset;
            this.direction = (this.direction + 1) % this.tetromino.length;
            this.activeTetromino = temp;
            this.drawSide2(Arena);
        }

    }

    lock() {

        for (var r = 0; r < this.activeTetromino.length; r++) {
            for (var c = 0; c < this.activeTetromino.length; c++) {
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

                Board.board[this.y + r][this.x + c] = this.color;
            }
        }
        // remove full rows
        for (var r = 0; r < ROWS; r++) {
            let isRowFull = true;
            for (var c = 0; c < COLS; c++) {
                isRowFull = isRowFull && (Board.board[r][c] != VACANT);
            }
            if (isRowFull) {
                // if the row is full
                // we move down all the rows above it
                for (var y = r; y > 1; y--) {
                    for (c = 0; c < COLS; c++) {
                        Board.board[y][c] = Board.board[y - 1][c];
                    }
                }
                // the top row board[0][..] has no row above it
                for (var c = 0; c < COLS; c++) {
                    Board.board[0][c] = VACANT;
                }
                score += 100;
            }
        }
        // update the board
        drawBoard(Board);
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