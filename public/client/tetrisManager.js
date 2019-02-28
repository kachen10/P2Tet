class TetrisManager {
    constructor(document) {
        this.document = document;
        this.template = this.document.querySelector('#player_template');
        this.instances =[];
    }   
}