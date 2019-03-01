
var xoff = 0;


function setup() {
    createCanvas( 400, 400 )    
}


function draw() {
    background(51);

    var x = map(noise(xoff), 0, 1, 0, width);
    var y = map(noise(xoff), 0, 1, 0, height);
    xoff += 0.02;

    ellipse(x, 200, 24, 24);
}