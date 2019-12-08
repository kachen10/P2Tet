class board {
  constructor() {
    this.board = [];
    for (let row = 0; row < ROWS; row++) {
      this.board[row] = [];
      for (let col = 0; col < COLS; col++) {
        this.board[row][col] = VACANT;
      }
    }
  }
}

