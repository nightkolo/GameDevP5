class Player {
  constructor(){
    this.x = 0.0;
    this.y = 0.0;
  }
  update(){
    this.x = mouseX;
    this.y = mouseY;
  }
  show(){
    square(this.x, this.y, 50.0);
  }
}