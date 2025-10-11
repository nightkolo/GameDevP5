class Bullet {
  constructor(px, py, dirX = 0, dirY = -1, spd = 10.0, size = 25.0){
    this.dirX = dirX;
    this.dirY = dirY;
    this.x = px;
    this.y = py;
    this.spd = spd;
    this.health = 1;

    this.size = size;
  }
  update(){
    this.x += this.dirX * this.spd;
    this.y += this.dirY * this.spd;
  }
  show(){
    fill(255);
    circle(this.x, this.y, this.size);
  }
  offScreen(){
    return (this.x > canSize.x || this.x < 0.0 || this.y > canSize.y || this.y < 0.0);
  }
}