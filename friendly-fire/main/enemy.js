class Enemy {
  constructor({ 
    x = 200,
    y = 200,
    health = 10,
    player,
    // followPlayer = false,
    bulletDir = { x: 0, y: -1 },
    canFire = false
  } = {}){
    // Pos
    this.x = x;
    this.y = y;
    // Stats
    this.size = this.getSize();
    this.health = health;
    // Data
    this.player = player;
    this.bulletDir = bulletDir;

    // Type
    this.canFire = canFire;

    // Misc
    this.lastSpawnTime = 0.0;

    // this.followPlayer = followPlayer;
  }
  // Factory methods for common types
  // static createFollower(player, x, y) {
  //   return new Enemy({ x, y, player, followPlayer: true });
  // }
  moveTowardPlayer() {
    // if (this.followPlayer) {
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
    // }
  }
  fire(){
    // req sketch.js
    // let firingSpd = 0.5;
    
    // if (millis() - lastSpawnTime > firingSpd * 1000.0) {
    //   print(this, "Shoot");
    //   enemyBullets.push(new Bullet(this.x, this.y));
    //   lastSpawnTime = millis();
    //   print(enemyBullets);
    // }
  }
  update() {
    this.size = this.getSize();

    this.moveTowardPlayer();
    this.fire();
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
    let strength = 4.0;

    this.x += strength * this.bulletDir.x;
    this.y += strength * this.bulletDir.y;
  }
  hasDied() {
    return this.health < 1;
  }
  toString() {
    return `${this.health}, ${this.x}, ${this.y}`;
  }
}
