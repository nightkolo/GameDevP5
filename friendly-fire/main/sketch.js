const canSize = { x: 900, y: 720 }; // 5:4

// Game: Tank is Dry

// TODO use modules for multiple js files

// Objects
let p;
let e1;
let playerBullets = [];
let enemyBullets = [];
let enemies = [];
let isShooting = false;

// Game Loop
let rounds = 0;
let score = 0;
let difficulty = 0;
let gameOver = false;

// Debug
let noShoot = false;
let curBulletDir = {
  x: 0,
  y: -1, // default: up
};

let lastSpawnTime = 0.0;
let shootingSpdFactor = 0.0625;

// TODO current issue
// enemies spawn at random with completely random attributes
// add pre-defined rounds for a sense of progression...
// Fixed perhaps

function spawnRoundEnemies(onRound = rounds) {
  const roundEnemies = Game.waves[onRound - 1];

  print(roundEnemies);

  if (roundEnemies == undefined) {
    gameOver = true;
    return;
  }

  for (let i = 0; i < roundEnemies.length; i++) {
    print(roundEnemies[i]);

    let spawnX = random() * width;
    let spawnY = random() * height;
    let healthRange = roundEnemies[i].hp[1] - roundEnemies[i].hp[0];

    print(healthRange);

    let randomhealth = roundEnemies[i].hp[0] + floor(random() * healthRange);

    for (let j = 0; j < roundEnemies[i].count; j++) {
      let newEnemy = new Enemy({
        x: spawnX,
        y: spawnY,
        health: randomhealth,
        player: p,
        type: roundEnemies[i].type,
      });

      enemies.push(newEnemy);
    }
  }
}

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

    const types = Object.values(Game.EnemyTypes);
    const randomType = random(types);

    let newEnemy = new Enemy({
      x: spawnX,
      y: spawnY,
      health: health,
      player: p,
      bulletDir: curBulletDir,
      type: randomType,
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
  let removeBullet = false;

  // Enemy detection
  enemies.forEach((e) => {
    if (
      GameMath.circleCollision(e.x, e.y, e.size / 2.0, b.x, b.y, b.size / 2.0)
    ) {
      e.hit(b.dirX, b.dirY);

      if (e.hasDied()) {
        let scoreGained = e.points;

        if (e.type == Game.EnemyTypes.EXPLODER) {
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

          score += scoreGained;
        }
      }

      if (e.type == Game.EnemyTypes.REFLECTOR) {
        print("Reflect");

        b.dirX *= -1;
        b.dirY *= -1;
      } else {
        removeBullet = true;
      }
    }
  });

  b.update();
  b.show();

  return !removeBullet && !b.offScreen();
}

function handleEnemies() {
  // Generates enemies
  enemies.forEach((e) => {
    if (e.spawnBullets() && e.canShoot) {
      let spd = 4.0;
      let size = 75.0;

      enemyBullets.push(new Bullet(e.x, e.y, 0, -1, spd, size));
      enemyBullets.push(new Bullet(e.x, e.y, 0, 1, spd, size));
      enemyBullets.push(new Bullet(e.x, e.y, -1, 0, spd, size));
      enemyBullets.push(new Bullet(e.x, e.y, 1, 0, spd, size));
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
    type: Game.EnemyTypes.NORMAL,
    followPlayer: false,
    bulletDir: curBulletDir,
  });
  enemies.push(e1);
}

function enemiesDefeated() {
  return enemies.length == 0 && !gameOver;
}

function draw() {
  background("#d1d166ff");
  noCursor();
  frameRate(60);
  rectMode(CENTER);

  // Enemies defeated
  if (enemiesDefeated()) {
    gotoNextRound();
    // spawnRoundEnemies();
  }

  // Spawn playerBullets
  if (isShooting && !noShoot) {
    if (millis() - lastSpawnTime > shootingSpdFactor * 1000.0) {
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
    p.enemies = enemies;
    noShoot = p.insideAnEnemy(false);

    if (p.insideAnEnemy()) {
      // TODO add better feedback for player getting hit
      p.hit();
    }

    p.update();
    p.show();
  }

  displayText();
}

function displayText() {
  textAlign(LEFT);
  textSize(45);
  text(`Round: ${rounds}`, 100, height - 100);
  text(`Your Score: ${score}`, 100, height - 150);
}

function gotoNextRound() {
  rounds++;
  print(rounds);

  // spawnEnemies();
  spawnRoundEnemies();
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
