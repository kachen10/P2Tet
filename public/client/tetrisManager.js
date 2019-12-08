class TetrisManager {

  constructor(document) {
    this.document = document;
    this.template = this.document.querySelector('#player_template');
    this.instances = [];
    this.newBoard = null;
    this.players = 0;
  }

  newCanvas() {
    const node = document.createElement("div");
    node.id = "P2";
    document.body.appendChild(node);
  }

}

