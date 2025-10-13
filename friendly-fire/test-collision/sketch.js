function circleCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (r1 + r2);
  }

function setup() {
  createCanvas(400, 400);
}
let x = 0.0;
let y =0.0;

function draw() {
  background(220);

  rectMode(CENTER);

  x = mouseX;
  y = mouseY;

  square(x, y, 50.0)
  circle(width/2, height/2, 50.0);

  print(circleCollision(x, y, 50.0 / 2, width/2, height/2, 50.0 / 2))
}
