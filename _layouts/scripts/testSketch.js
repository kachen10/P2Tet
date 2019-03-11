
var font;
var vehicles = []
function preload() {
    font = loadFont('./scripts/Miracle.otf');   // this file must exists
}

function setup() {
    createCanvas(1000, 300);
    colorMode(HSB, 255);
    // draw dots where there is text

    var points = font.textToPoints('Happy Birthday', 100, 200, 128);
    console.log(points);

    

    for (var i = 0; i < points.length; i ++) {
        var pt = points[i];
        var vehicle = new Vehicle(pt.x, pt.y);
        vehicles.push(vehicle);
    }
};

function draw() {
    background(51);
    for (var i = 0; i < vehicles.length; i++) {
        var v = vehicles[i];
        v.behaviors();
        v.update();
        v.show();
    }
}