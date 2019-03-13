class Tetris {

    constructor(tetromino, color, id) {
        this.tetromino = tetromino;
        this.direction = 0;

        this.activeTetromino = this.tetromino[this.direction];

        this.color = color;
        this.id = id;

        this.x = 3;
        this.y = -1;
        this.end = false;
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

        if (!this.collision(Board, 0, 1, this.activeTetromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.lock(Board, 1);
            p = randomPiece();
            current = p;
            current.drawSide(panel);

        }
    }

    moveDownTest() {

        if (!this.collision(PLAYER.newBoard, 0, 1, this.activeTetromino)) {
            this.undrawSide(Arena);
            this.y++;
            this.drawSide2(Arena);
        } else {
            this.lock(PLAYER.newBoard, 2);
            newPiece = randomPiece();

        }
    }



    moveLeft() {
        if (!this.collision(Board, -1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }
    moveLeftTest() {
        if (!this.collision(PLAYER.newBoard, -1, 0, this.activeTetromino)) {
            this.undrawSide(Arena);
            this.x--;
            this.drawSide2(Arena);
        }
    }

    moveRight() {
        if (!this.collision(Board, 1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }
    moveRightTest() {
        if (!this.collision(PLAYER.newBoard, 1, 0, this.activeTetromino)) {
            this.undrawSide(Arena);
            this.x++;
            this.drawSide2(Arena);
        }
    }


    FastDown() {

        this.unDraw();
        while (!this.collision(Board, 0, 1, this.activeTetromino)) {
            this.y++;
        }
        this.draw();
        this.lock(Board, 1);
        p = randomPiece();
        current = p;
        current.drawSide(panel);

    }

    FastDownTest() {

        this.undrawSide(Arena);
        while (!this.collision(PLAYER.newBoard, 0, 1, this.activeTetromino)) {
            this.y++;
        }
        this.drawSide2(Arena);
        this.lock(PLAYER.newBoard, 2);
        newPiece = randomPiece();
    }

    collision(BOARD, x, y, piece) {
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
                if (BOARD.board[newY][newX] != VACANT) {
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
        if (this.collision(Board, 0, 0, temp)) {
            if (this.x > COLS / 2) {
                offset = -1;
            } else {
                offset = 1;
            }
        }
        if (!this.collision(Board, offset, 0, temp)) {
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
        if (this.collision(PLAYER.newBoard, 0, 0, temp)) {
            if (this.x > COLS / 2) {
                offset = -1;
            } else {
                offset = 1;
            }
        }
        if (!this.collision(PLAYER.newBoard, offset, 0, temp)) {
            this.undrawSide(Arena);
            this.x += offset;
            this.direction = (this.direction + 1) % this.tetromino.length;
            this.activeTetromino = temp;
            this.drawSide2(Arena);
        }

    }

    lock(BOARD, id) {

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

                BOARD.board[this.y + r][this.x + c] = this.color;
            }
        }
        // remove full rows
        for (var r = 0; r < ROWS; r++) {
            let isRowFull = true;
            for (var c = 0; c < COLS; c++) {
                isRowFull = isRowFull && (BOARD.board[r][c] != VACANT);
            }
            if (isRowFull) {
                // if the row is full
                // we move down all the rows above it
                for (var y = r; y > 1; y--) {
                    for (c = 0; c < COLS; c++) {
                        BOARD.board[y][c] = BOARD.board[y - 1][c];
                    }
                }
                // the top row board[0][..] has no row above it
                for (var c = 0; c < COLS; c++) {
                    BOARD.board[0][c] = VACANT;
                }

                score += 100;
                
            }
        }
        // update the board
        drawBoard(Board);
        drawSideBar(panel);

        scoreElement.innerHTML = score;
        score2Element.innerHTML = scorep2;
        
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