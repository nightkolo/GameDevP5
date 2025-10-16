class Flower {
  constructor(x, y){
    this.x = x 
    this.y = y 
    this.velocity = 0.5;
    this.dir = {
      x: 1,
      y: 1
    }
    this.diameter = 50.0;
  }
  show(){
    circle(this.x, this.y, this.diameter);
  }
  update(){
    this.x += this.dir.x * this.velocity;
    this.y += this.dir.y * this.velocity;

    if (this.x > width - (this.diameter/2) || this.x < (this.diameter/2)){
      this.dir.x *= -1;
    }

    if (this.y > height - (this.diameter/2) || this.y < (this.diameter/2)){
      this.dir.y *= -1;
    }
  }
  getMousePos(){
    return {
      x: mouseX,
      y: mouseY
    }
  }
}

let fImg;
function preload(){
  fImg = loadImage();
}

let flowers = [];

function setup() {
  createCanvas(400, 400);

  for (let i = 0; i < 10; i++){
    let f = new Flower(width * random(), height * random());
    flowers.push(f);
  }
}

function draw() {
  background(220);
  flowers.forEach((f) => {
    f.update();
    f.show();
  })

  // print(f.getMousePos());
}
