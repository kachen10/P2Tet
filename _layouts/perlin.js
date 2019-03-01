
var scale = 20;

var start = 0;
var increment = 0.02;
var cols, rowsl


function setup() {
    createCanvas( 400, 400 );
    cols = floor(width /scale);
    cols = floor(height /scale);
}


function draw() {
    
    var yoff = 0;

    loadPixels();
    for (var x = 0; x < width; x++) {
        var xoff = 0;
        for (var y = 0; y < height; y++) {

            var index = ( x + y * width) * 4;
            var r = noise(xoff, yoff) * 255;
            pixels[index+0] = r;
            pixels[index+1] = r;
            pixels[index+2] = r;
            pixels[index+3] = r;

            xoff += increment;
        }  
        yoff += increment;
    }
    updatePixels();
    // noLoop();
    
    
}