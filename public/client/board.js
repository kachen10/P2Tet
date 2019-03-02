class board {
    constructor() {
        this.board = [];

        for (var row = 0; row < ROWS; row++) {
            this.board[row] = [];
            for (var col = 0; col < COLS; col++) {
              this.board[row][col] = VACANT;
            }
        }
    }
}

