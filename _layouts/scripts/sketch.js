
var perlin = function( p ) { 
  var increment = 0.1;
  var scl = 10;
  var cols, rows;
  var zoff = 0;

  this.fr;

  var particles = [];

  this.flowfield;
  
  p.setup = function() {
    p.createCanvas(400, 200);
        // colorMode(HSB, 255);
        cols = floor(width / scl);
        rows = floor(height / scl);
        p.fr = p.createP('');

        p.flowfield = new Array(cols * rows);

        for (var i = 0; i < 300; i++) {
            particles[i] = new Particle();
        }
  };

  p.draw = function() {
    var yoff = 0;
    p.background(255);
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = p.noise(xoff, yoff, zoff) * TWO_PI * 4;
        var v = p5.Vector.fromAngle(angle);
        // v.setMag(1);
        // flowfield[index] = v;
        xoff += increment;
        // stroke(0, 50);
        p.push();
        p.translate(x * scl, y * scl);
        p.rotate(v.heading());
        p.strokeWeight(1);
        p.line(0, 0, scl, 0);
        p.pop();
      }
      yoff += increment;
      zoff += 0.0003;
    }
 
  };
};

var myp5 = new p5(perlin, 'perlin');