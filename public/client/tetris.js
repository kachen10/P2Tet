const canvas = document.getElementById('tetris');
const sidebar = document.getElementById('side');
const save = document.getElementById('saved');
const scoreElement = document.getElementById('score');
const score2Element = document.getElementById('score2');
// const timeElement = document.getElementById('time');

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
var gameOver = false;
var score = 0;
var scorep2 = 0;
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
  [Z, '#fa983a'],
  [T, '#3c6382'],
  [I, '#e55039'],
  [J, '#38ada9'],
  [S, '#44bd32'],
  [L, '#e84393'],
  [O, '#a29bfe']
];

function randomPiece() {
  const random = Math.floor(Math.random() * PIECES.length);
  return new Tetris(PIECES[random][0], PIECES[random][1]);
}

function getSessionId() {
  return window.location.hash.split('#')[1];
}

// var address = 'http://localhost:5000';
let address = 'https://p2tetris.firebaseapp.com/';
let sessionId = null;
if (window.location.hash) {
  console.log("window check");
  sessionId = getSessionId();
  address += "/#" + sessionId;
  console.log("Address: ", address);
}

const socket = io.connect(address);
console.log("NEW PLAYER");
const idPlayer = createId();
const client_data = {
  id: idPlayer,
  tetro: randomPiece(idPlayer),
  session: sessionId
};
if (!window.location.hash) {
  window.location.hash = client_data.id;
}

socket.emit("start", client_data);

const Board = new board();

const currentPiece = [];
for (let row = 0; row < 6; row++) {
  currentPiece[row] = [];
  for (let col = 0; col < 6; col++) {
    currentPiece[row][col] = VACANT;
  }
}

const savedPiece = [];
for (let row = 0; row < 6; row++) {
  savedPiece[row] = [];
  for (let col = 0; col < 6; col++) {
    savedPiece[row][col] = VACANT;
  }
}

function drawSideBar(canvas) {

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
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

function drawSquare(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * SQ, y * SQ, SQ, SQ);

  context.strokeStyle = 'WHITE';
  context.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function drawBoard(Board) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      drawSquare(col, row, Board.board[row][col]);
    }
  }
}

function drawBoardTemp(canvas, Board) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      drawPiece(canvas, col, row, Board.board[row][col]);
    }
  }
}

drawBoard(Board);
socket.on('GameOn',
  function (data) {
    console.log("GAMEON");
    multiplayer = true;
  }
);

if (multiplayer === true) {
  sessionId = getSessionId();
  console.log("Draw");
}

const PLAYER = new TetrisManager(document);
PLAYER.newBoard = new board();

drawBoardTemp(Arena, PLAYER.newBoard);
drawSideBar(panel);
drawSideBar(stack);

p = randomPiece();
socket.on('newPlayer',
  function (data) {
    p = new Tetris(data.tetromino, data.color);
    saved = 0;
    current = p;
    current.drawSide(panel);
  });

document.addEventListener("keydown", CONTROL);
const KeyPressed = {
  left: 37, up: 38, right: 39, down: 40,
  space: 32, shift: 16
};

function CONTROL(event) {
  let moveData;
  if (event.keyCode === KeyPressed.right) {
    p.moveRight();

    sessionId = getSessionId();
    moveData = {
      piece: p,
      sessionId: sessionId
    };
    socket.emit("moveRight", moveData);

    dropStart = Date.now();
  } else if (event.keyCode === KeyPressed.left) {
    p.moveLeft();

    sessionId = getSessionId();
    moveData = {
      piece: p,
      sessionId: sessionId
    };
    socket.emit("moveLeft", moveData);
    dropStart = Date.now();

  } else if (event.keyCode === KeyPressed.down) {
    p.moveDown();

    sessionId = getSessionId();
    moveData = {
      piece: p,
      sessionId: sessionId
    };
    socket.emit("moveDown", moveData);

  } else if (event.keyCode === KeyPressed.up) {
    p.rotate();

    sessionId = getSessionId();
    moveData = {
      piece: p,
      sessionId: sessionId,
    };
    socket.emit("moveRotate", moveData);
    dropStart = Date.now();
  } else if (event.keyCode === KeyPressed.space) {
    const prev = p;
    p.FastDown();
    sessionId = getSessionId();
    moveData = {
      piece: prev,
      sessionId: sessionId
    };
    socket.emit("moveFastDown", moveData);

  } else if (event.keyCode === KeyPressed.shift) {
    p.pieceSaved();
    sessionId = getSessionId();
    moveData = {
      piece: p,
      sessionId: sessionId
    };
    socket.emit("pieceSaved", moveData);
  }
}

let dropStart = Date.now();

let dropInterval = 1000;
let lastTime = 0;
let endGame = false;

function update(time = 0) {

  const now = Date.now();
  const delta = now - dropStart;

  if (delta > dropInterval) {
    socket.on('Winner', function (data) {
      console.log("Loser received");
      if (p.id === "loser") {
        alert("You Lost");
      } else {
        alert(data.message);
      }
    });
    socket.on('saved', function (data) {
      newPiece.undrawSide(Arena);
    });

    socket.on('Rotate', function (data) {
      // console.log("in GAME, ROTATE recieved: ", data);

      newPiece.undrawSide(Arena);
      newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
      newPiece.x = data.piece.x;
      newPiece.y = data.piece.y;
      newPiece.direction = data.piece.direction;
      newPiece.activeTetromino = data.piece.activeTetromino;

      newPiece.drawSide2(Arena);

    });
    socket.on('Left', function (data) {
      // console.log("in GAME, LEFT recieved: ", data);
      newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
      // newPiece = data.piece;
      newPiece.x = data.piece.x + 1;
      newPiece.y = data.piece.y;
      newPiece.direction = data.piece.direction;
      newPiece.activeTetromino = data.piece.activeTetromino;

      newPiece.moveLeftTest();
    });
    socket.on('Right', function (data) {
      // console.log("in GAME, recieved: ", data);
      newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
      newPiece.x = data.piece.x - 1;
      newPiece.y = data.piece.y;
      newPiece.direction = data.piece.direction;
      newPiece.activeTetromino = data.piece.activeTetromino;

      newPiece.moveRightTest();
    });
    socket.on('FastDown', function (data) {
      // console.log("in GAME, received: ", data);
      newPiece.undrawSide(Arena);
      newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
      newPiece.x = data.piece.x;
      newPiece.y = data.piece.y;
      newPiece.direction = data.piece.direction;
      newPiece.activeTetromino = data.piece.activeTetromino;

      newPiece.FastDownTest();
    });
    socket.on('Down', function (data) {
      // console.log("in GAME, recieved: ", data);
      newPiece = new Tetris(data.piece.tetromino, data.piece.color, data.piece.id);
      newPiece.x = data.piece.x;
      newPiece.y = data.piece.y - 1;
      newPiece.direction = data.piece.direction;
      newPiece.activeTetromino = data.piece.activeTetromino;

      newPiece.moveDownTest();
    });

    p.moveDown();

    // sending to all clients in 'game1' and/or in 'game2' room, except sender
    sessionId = getSessionId();
    const moveData = {
      piece: p,
      sessionId: sessionId,
      board: Board,
    };
    socket.emit("moveDown", moveData);

    score += 100;
    const scores = {
      sessionId: sessionId,
      score: score
    };
    socket.emit("scores", scores);

    scoreElement.innerHTML = score;
    if (newPiece != null) {
      socket.on('dispScores', function (data) {
        scorep2 = data.score;
      })
    }
    score2Element.innerHTML = scorep2;
    dropStart = Date.now();

  }
  if (!gameOver) {
    requestAnimationFrame(update);
  } else if (gameOver && endGame === false) {
    endGame = true;
    sessionId = getSessionId();
    p.id = "loser";
    console.log("p.id: ", p.id);
    const loserID = {
      sessionId: sessionId,
      loserId: "loser"
    };
    socket.emit("gameOver", loserID);
    console.log("Loser emitted");
    update();

    // break;
  }
}

update();
