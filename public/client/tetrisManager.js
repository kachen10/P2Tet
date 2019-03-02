class TetrisManager {

    

    constructor(document) {
        this.document = document;
        this.template = this.document.querySelector('#player_template');
        this.instances = [];
        this.newBoard = [];
    } 
    
    newCanvas() {
        var node = document.createElement("div");
        node.id = "P2";
        document.body.appendChild(node);   
    }

}

