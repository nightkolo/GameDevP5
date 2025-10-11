class Enemy {
  constructor(px = 200.0, py = 200.0, h = 10, player, followPlayer){
    this.x = px;
    this.y = py;
    this.health = h;
    this.size = this.getSize();

    this.player = player; // type: Player
    this.followPlayer = followPlayer;
  }
  getSize(){
    return 80.0 + (this.health * 5.0);
  }
  update(){
    this.size = this.getSize();

    this.moveTowardPlayer();

    // TODO follow player....
    // print(this.player.x, this.player.y);
  }
  show(){
    rectMode(CENTER);
    circle(this.x, this.y, this.size);
    text(`${this.health}`, this.x, this.y);
    textSize(40.0);
    textAlign(CENTER);
  }
  moveTowardPlayer() {
    if (this.followPlayer){
      let dx = this.player.x - this.x;
      let dy = this.player.y - this.y;
      let dist = sqrt(dx * dx + dy * dy);
  
      if (dist > 0) {
        dx /= dist;
        dy /= dist;
        let speed = 0.5;
        this.x += dx * speed;
        this.y += dy * speed;
      }
    }
  }
  circleCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (r1 + r2);
  }
  insidePlayer(){
// print(this.player.x, this.player.y, this.player.size/2)
// print(this.x, this.y, this.getSize()/2)


    let hit = this.circleCollision(
      this.player.x,
      this.player.y,
      this.player.size / 2.0,
      this.x,
      this.y,
      this.getSize() / 2.0
    );
    if (hit) {
      print(`Enemy at (${this.x}, ${this.y}) is touching Player`);
    }

    return hit;
  }

  
  hit(){
    this.health--;
  }
  hasDied(){
    return (this.health < 1);
  }
  toString(){
    return `${this.health}, ${this.x}, ${this.y}`
  }
}