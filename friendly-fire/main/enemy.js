class Enemy {
  constructor(px = 200.0,
    py = 200.0,
    h = 10,
    player,
    followPlayer,
    bulletDir) {
    this.x = px;
    this.y = py;
    this.health = h;
    this.size = this.getSize();

    this.player = player; // type: Player
    this.followPlayer = followPlayer;
    this.bulletDir = bulletDir;

    this.knockbackStrength = 3.0;
  }
  moveTowardPlayer() {
    if (this.followPlayer) {
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
  update() {
    this.size = this.getSize();

    this.moveTowardPlayer();
  }
  show() {
    rectMode(CENTER);
    circle(this.x, this.y, this.size);
    text(`${this.health}`, this.x, this.y);
    textSize(40.0);
    textAlign(CENTER);
  }
  getSize() {
    return 80.0 + this.health * 5.0;
  }
  isInsidePlayer() {
    // experimental
    return GameMath.circleCollision(
      this.player.x,
      this.player.y,
      this.player.size / 2.0,
      this.x,
      this.y,
      this.getSize() / 2.0
    );
  }
  hit() {
    this.health--;
    this.knockback();
  }
  knockback(){
    this.x += this.knockbackStrength * this.bulletDir.x;
    this.y += this.knockbackStrength * this.bulletDir.y;

  }
  hasDied() {
    return this.health < 1;
  }
  toString() {
    return `${this.health}, ${this.x}, ${this.y}`;
  }
}
