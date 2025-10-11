const canSize = { x: 900, y: 750 }; // 6:5

// Objects
let p;
let e1;
let playerBullets = [];
let enemyBullets = [];
let enemies = [];

// Game Loop
let rounds = 1;
let difficulty = 0;

// Debug
let noShoot = true;
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
let firingSpdFactor = 0.125 / 2.0;

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
      canFire: random() < 1 / 4,
    });

    enemies.push(newEnemy);
  }
}

function handlePlayerBullet(b) {
  let enemyHasDied = false;

  // Enemy detection
  enemies.forEach((e) => {
    if (GameMath.circleCollision(e.x, e.y, e.size / 2.0, b.x, b.y, b.size / 2.0)) {
      e.hit();

      if (e.hasDied()) {
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

  // Keep bullet only if it hasn't hit anything AND isn't offscreen
  return !enemyHasDied && !b.offScreen();
}

function handleEnemies() {
  // Generates enemies
  enemies.forEach((e) => {
    if (e.tryFire()) {
      let spd = 4.0;
      let size = 75.0;

      enemyBullets.push(new Bullet(e.x, e.y, 0, -1, spd, size));
      enemyBullets.push(new Bullet(e.x, e.y, 0, 1, spd, size));

      enemyBullets.push(new Bullet(e.x, e.y, -1, 0, spd, size));
      enemyBullets.push(new Bullet(e.x, e.y, 1, 0, spd, size));

      // print(`${e} has fired.`);
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
    canFire: true,
  });
  enemies.push(e1);
}

function draw() {
  background(125);
  noCursor();

  rectMode(CENTER);

  // Enemies defeated
  if (enemies.length == 0) {
    gotoNextRound();
  }

  // Spawn playerBullets
  if (!noShoot) {
    if (millis() - lastSpawnTime > firingSpdFactor * 1000.0) {
      playerBullets.push(new Bullet(p.x, p.y, curBulletDir.x, curBulletDir.y));
      lastSpawnTime = millis();
    }
  }

  // Handle playerBullets
  playerBullets = playerBullets.filter(handlePlayerBullet);

  // Handle enemyBullets
  enemyBullets = enemyBullets.filter((b) => {
    b.update();
    b.show();

    return !b.offScreen();
  });

  handleEnemies();

  // player
  p.update();
  p.show();
}

function mousePressed() {
  noShoot = !noShoot;
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
