const canSize = { x: 900, y: 750 }; // 6:5

// Objects
let p;
let e1;
let bullets = [];
let enemies = [];

// Game Loop
let rounds = 1;

// Debug
let noShoot = true;

function setup() {
  createCanvas(canSize.x, canSize.y);

  p = new Player();

  e1 = new Enemy(width / 2, height / 2, 10, p, false, curBulletDir);
  enemies.push(e1);
}

function gotoNextRound() {
  rounds++;
  print(rounds);

  spawnEnemies(rounds);
}

let lastSpawnTime = 0.0;
let firingSpdFactor = 0.125 / 2.0;

function spawnEnemies(onRound = rounds) {
  let healthMin = 3;
  let enemySpawnsMin = 3;
  let enemySpawnsFactor = 3;

  let noOfEnemies = enemySpawnsMin + floor(random() * enemySpawnsFactor);

  for (let i = 0; i < noOfEnemies; i++) {
    let spawnX = random() * width;
    let spawnY = random() * height;
    let health = healthMin + floor(random() * 20);

    let newEnemy = new Enemy(
      spawnX, 
      spawnY, 
      health, 
      p, 
      true,
      curBulletDir
    );
    enemies.push(newEnemy);
  }
}

function enemiesDefeated() {
  // experimental
  return enemies.length == 0;
}

function draw() {
  background(0);
  noCursor();

  rectMode(CENTER);

  // Enemies defeated
  if (enemiesDefeated()) {
    gotoNextRound();
  }

  // Spawn Bullets
  if (!noShoot) {
    if (millis() - lastSpawnTime > firingSpdFactor * 1000.0) {
      bullets.push(new Bullet(p.x, p.y, curBulletDir.x, curBulletDir.y));
      lastSpawnTime = millis();
    }
  }

  // Generate enemies
  enemies.forEach((e) => {
    e.update();
    e.show();

    e.isInsidePlayer();
  });

  // Handle bullets
  bullets = bullets.filter((b) => {
    b.update();
    b.show();

    let hasDied = false;
    // Enemy detection
    enemies.forEach((e) => {
      if (b.hitsCircle(e.x, e.y, e.size / 2.0, e.size)) {
        e.hit();

        if (e.hasDied()) {
          const index = enemies.indexOf(e);

          if (index > -1) {
            enemies.splice(index, 1);
          }
        }

        hasDied = true;
      }
    });

    return !hasDied;
    // return !hit && !(b.offScreen());
  });

  // player
  p.update();
  p.show();
}

let curBulletDir = {
  x: 0,
  y: -1, // default: up
};

// woops
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
