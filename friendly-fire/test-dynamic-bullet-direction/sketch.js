const canSize = { x: 900, y: 720 }; // 5:4

// Game: Tank is Dry

// Objects
let p;
let e1;
let playerBullets = [];
let enemyBullets = [];
let enemies = [];
let isShooting = false;

// Game Loop
let rounds = 1;
let difficulty = 0;

// Debug
let noShoot = false;
let curBulletDir = {
  x: 0,
  y: -1, // default: up
};

function gotoNextRound() {
  rounds++;
  print(rounds);

  spawnEnemies();
}

let lastSpawnTime = 0.0;
let firingSpdFactor = 0.0625;

function spawnEnemies() {
  let healthMin = 3;
  let healthFactor = 20.0;
  let enemySpawnsMin = 3;
  let enemySpawnsFactor = 3;

  let noOfEnemies = enemySpawnsMin + floor(random() * enemySpawnsFactor);

  for (let i = 0; i < noOfEnemies; i++) {
    let spawnX = random() * width;
    let spawnY = random() * height;
    let health = healthMin + floor(random() * healthFactor);

    let newEnemy = new Enemy({
      x: spawnX,
      y: spawnY,
      health: health,
      player: p,
      bulletDir: curBulletDir,
      canFire: random() < 1 / 4
      // diagonalFiring: random() < 1 / 2,
    });

    enemies.push(newEnemy);
  }
}

function handleEnemyBullet(b) {
  b.update();
  b.show();

  if (!b.alive) {
    const index = enemyBullets.indexOf(b);

    if (index > -1) {
      enemyBullets.splice(index, 1);
    }
  }

  if (
    GameMath.circleCollision(b.x, b.y, b.size / 2.0, p.x, p.y, p.size / 2.0)
  ) {
    p.hit();

     // TODO if player is invincinble, make bullets not splice

    const index = enemyBullets.indexOf(b);

    if (index > -1) {
      enemyBullets.splice(index, 1);
      }
    }

    playerIsHit = true;
}
function handlePlayerBullet(b) {
  let enemyHasDied = false;

  // Enemy detection
  enemies.forEach((e) => {
    if (
      GameMath.circleCollision(e.x, e.y, e.size / 2.0, b.x, b.y, b.size / 2.0)
    ) {
      e.hit(b.dirX, b.dirY);

      if (e.hasDied()) {
        if (e.exploder){
          let spd = 4.0;
          let size = 75.0;  

          enemyBullets.push(new Bullet(e.x, e.y, 0, -1, spd, size));
          enemyBullets.push(new Bullet(e.x, e.y, 0, 1, spd, size));
          enemyBullets.push(new Bullet(e.x, e.y, -1, 0, spd, size));
          enemyBullets.push(new Bullet(e.x, e.y, 1, 0, spd, size));
          enemyBullets.push(new Bullet(e.x, e.y, -1, -1, spd, size));
          enemyBullets.push(new Bullet(e.x, e.y, 1, 1, spd, size));
          enemyBullets.push(new Bullet(e.x, e.y, -1, 1, spd, size));
          enemyBullets.push(new Bullet(e.x, e.y, 1, -1, spd, size));
        }

        const index = enemies.indexOf(e);
        if (index > -1) {
          enemies.splice(index, 1);
        }
      }

      enemyHasDied = true;
    }
  });

  b.update();
  b.show();

  return !enemyHasDied && !b.offScreen();
}

function handleEnemies() {
  // Generates enemies
  enemies.forEach((e) => {
    if (e.tryFire()) {
      let spd = 4.0;
      let size = 75.0;
      // if (e.diagonalFiring){
      //   enemyBullets.push(new Bullet(e.x, e.y, -1, -1, spd, size));
      //   enemyBullets.push(new Bullet(e.x, e.y, 1, 1, spd, size));
      //   enemyBullets.push(new Bullet(e.x, e.y, -1, 1, spd, size));
      //   enemyBullets.push(new Bullet(e.x, e.y, 1, -1, spd, size));

      // } else {
      enemyBullets.push(new Bullet(e.x, e.y, 0, -1, spd, size));
      enemyBullets.push(new Bullet(e.x, e.y, 0, 1, spd, size));
      enemyBullets.push(new Bullet(e.x, e.y, -1, 0, spd, size));
      enemyBullets.push(new Bullet(e.x, e.y, 1, 0, spd, size));
      // }
    }

    e.update();
    e.show();
  });
}

function setup() {
  createCanvas(canSize.x, canSize.y);

  p = new Player();

  e1 = new Enemy({
    x: width / 2,
    y: height / 2,
    health: 10,
    player: p,
    canFire: false,
    bulletDir: curBulletDir,
  });
  enemies.push(e1);
}

function draw() {
  background("#d1d166ff");
  noCursor();

  frameRate(60);

  rectMode(CENTER);

  // Enemies defeated
  if (enemies.length == 0) {
    gotoNextRound();
  }

  // Spawn playerBullets
  if (isShooting && !noShoot) {
    if (millis() - lastSpawnTime > firingSpdFactor * 1000.0) {
      playerBullets.push(new Bullet(p.x, p.y, curBulletDir.x, curBulletDir.y));
      lastSpawnTime = millis();
    }
  }

  // Handle playerBullets
  playerBullets = playerBullets.filter(handlePlayerBullet);

  // Handle enemyBullets
  enemyBullets.forEach(handleEnemyBullet);

  handleEnemies();

  // TODO player death incomplete
  if (p.alive) {
    // print(enemies);
    p.enemies = enemies;
    noShoot = p.insideAnEnemy(false);

    if (p.insideAnEnemy()){

      // TODO add better feedback for player getting hit
      p.hit();
    }

    p.update();
    p.show();
  }
}

function mousePressed() {
  isShooting = !isShooting;
}

function keyPressed(event) {
  if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    curBulletDir.x = 0;
    curBulletDir.y = -1;
  } else if (
    event.key === "ArrowDown" ||
    event.key === "s" ||
    event.key === "S"
  ) {
    curBulletDir.x = 0;
    curBulletDir.y = 1;
  } else if (
    event.key === "ArrowLeft" ||
    event.key === "a" ||
    event.key === "A"
  ) {
    curBulletDir.x = -1;
    curBulletDir.y = 0;
  } else if (
    event.key === "ArrowRight" ||
    event.key === "d" ||
    event.key === "D"
  ) {
    curBulletDir.x = 1;
    curBulletDir.y = 0;
  }
}
