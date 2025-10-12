class Enemy {
  constructor({
    x = 200,
    y = 200,
    health = 10,
    bulletDir = { x: 0, y: -1 },
    canFire = false,
    player
  } = {}) {

    this.x = x;
    this.y = y;
    // Stats
    this.size = this.getSize();
    this.health = health;
    // Data
    this.player = player;
    this.bulletDir = bulletDir;

    // TODO better variable names

    // Type
    this.canFire = false;
    
    // Misc.
    this.storeCanFire = canFire;
    this.lastShotTime = 0;
    this.firingCooldown = 1.25;
    this.hasSpawned = false;

    this.spawned();
  }
  spawned() {
    setTimeout(() => this.isReady(), 1000.0);
  }
  isReady() {
    this.hasSpawned = true;
    this.canFire = this.storeCanFire;
  }
  moveTowardPlayer() {
    if (this.player == null) return;

    let dx = this.player.x - this.x;
    let dy = this.player.y - this.y;
    let dist = sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      dx /= dist;
      dy /= dist;
      let speed = 0.25;
      this.x += dx * speed;
      this.y += dy * speed;
    }
  }
  update() {
    this.size = this.getSize();

    if (!this.hasSpawned) return;

    this.moveTowardPlayer();
  }
  show() {
    rectMode(CENTER);

    if (this.storeCanFire) {
      fill(255, 0, 0);
    } else {
      fill(255, 255, 255);
    }

    circle(this.x, this.y, this.size);

    fill(255);
    strokeWeight(5);
    stroke(0);
    textSize(40.0);
    textAlign(CENTER);

    text(`${this.health}`, this.x, this.y);
  }
  tryFire() {
    if (!this.canFire) return false;

    if (millis() - this.lastShotTime > this.firingCooldown * 1000) {
      this.lastShotTime = millis();
      return true; // ready to fire
    }
    return false;
  }
  getSize() {
    return 80.0 + this.health * 5.0;
  }
  isInsidePlayer() {// experimental
    if (this.player == null) return;
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
  knockback() {
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
