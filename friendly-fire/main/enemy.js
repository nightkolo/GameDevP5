class Enemy {
  constructor(
    {
    x = 200,
    y = 200,
    health = 10,
    speed = 0.75,
    type = Util.EnemyTypes,
    player
  } = {}
) {
    this.x = x;
    this.y = y;
    // Stats
    this.size = this.getSize();
    this.speed = speed;
    this.health = health;
    this.points = round(health / 4.0);
    this.player = player;

    // Type
    this.type = type;
    
    // Misc.
    this.lastShotTime = 0;
    this.canShoot = false;
    this.shootingCooldown = 1.25;
    this.hasSpawned = false;

    this.spawned();
  }
  spawned() {
    setTimeout(() => {
      this.hasSpawned = true;
      this.canShoot = this.type == Util.EnemyTypes.SHOOTER;
    }, 1000.0);
  }
  moveTowardPlayer() {
    if (this.player == null) return;

    let dx = this.player.x - this.x;
    let dy = this.player.y - this.y;
    let dist = sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      dx /= dist;
      dy /= dist;
      let spd = this.speed;
      if (this.type == Util.EnemyTypes.SPRINTER){
        spd *= 10.0/3.0;
      }
      this.x += dx * spd;
      this.y += dy * spd;
    }
  }
  spawnBullets() {
    if (!this.canShoot && this.type != Util.EnemyTypes.SHOOTER) return false;

    if (millis() - this.lastShotTime > this.shootingCooldown * 1000) {
      this.lastShotTime = millis();
      return true; // ready to fire
    }
    return false;
  }
  update() {
    this.size = this.getSize();

    if (!this.hasSpawned) return;

    this.moveTowardPlayer();
  }
  show() {
    rectMode(CENTER);

    switch (this.type){
      case Util.EnemyTypes.NORMAL:
        fill(255);
        break;
      case Util.EnemyTypes.SHOOTER:
        fill(255, 0, 0);
        break;
      case Util.EnemyTypes.EXPLODER:
        fill(255, 255, 0);
        break;
      case Util.EnemyTypes.SPRINTER:
        fill(0, 0, 255);
        break;
      case Util.EnemyTypes.REFLECTOR:
        fill(100, 255, 100);
        break;
    }

    circle(this.x, this.y, this.size);

    fill(255);
    strokeWeight(5);
    stroke(0);
    textSize(40.0);
    textAlign(CENTER);

    text(`${this.health}`, this.x, this.y);
  }
  getSize() {
    return 80.0 + this.health * 5.0;
  }
  hit(hitX = 0, hitY = 0) {
    this.health--;
    this.knockback(hitX, hitY);
  }
  knockback(hitX, hitY) {
    let strength = 6.0;

    this.x += strength * hitX;
    this.y += strength * hitY;
  }
  hasDied() {
    return this.health < 1;
  }
  toString() {
    return `${this.health}, ${this.x}, ${this.y}`;
  }
}
