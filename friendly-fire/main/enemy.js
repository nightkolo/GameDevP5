class Enemy {
  constructor({ x = 200, y = 200, health = 10, player, followPlayer = false, bulletDir = { x: 0, y: -1 } } = {}){
    this.x = x;
    this.y = y;
    this.health = health;
    this.player = player;
    this.followPlayer = followPlayer;
    this.bulletDir = bulletDir;

    this.size = this.getSize();
    this.knockbackStrength = 3.0;
  }
  // Factory methods for common types
  static createFollower(player, x, y) {
    return new Enemy({ x, y, player, followPlayer: true });
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
