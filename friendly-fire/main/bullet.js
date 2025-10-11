class Bullet {
  constructor(px, py, dirX = 0, dirY = -1, spd = 10.0){
    this.dirX = dirX;
    this.dirY = dirY;
    this.x = px;
    this.y = py;
    this.spd = spd;
    this.health = 1;

    this.size = 25.0;
  }
  update(){
    this.x += this.dirX * this.spd;
    this.y += this.dirY * this.spd;
  }
  show(){
    circle(this.x, this.y, this.size);
  }
  offScreen(){
    return (this.x > canSize.x || this.x < 0.0 || this.y > canSize.y || this.y < 0.0);
  }
  // TODO move hitsCircle to utils.js
  hitsCircle(cx, cy, r) {
    let dx = this.x - cx;
    let dy = this.y - cy;
    let distance = sqrt(dx * dx + dy * dy);

    // r is the radius of target circle, this.size/2 is bullet radius
    return distance < r + this.size/2;
  }
}