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

function setup() {
  createCanvas(canSize.x, canSize.y);

  p = new Player();

  e1 = new Enemy({
    x: width / 2,
    y: height / 2,
    health: 10,
    player: p,
    canFire: true
    // followPlayer: false,
  });
  // e1 = new Enemy(width / 2, height / 2, 10, p, false, curBulletDir);
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
  let healthFactor = 20.0;
  let enemySpawnsMin = 3;
  let enemySpawnsFactor = 3;
  // if (onRound > 5 && onRound <= 10) {
  //   healthMin = 3;
  //   enemySpawnsMin = 4;
  //   enemySpawnsFactor = 4;
  // } else if (onRound > 10 && onRound <= 15) {
  //   healthMin = 5;
  //   enemySpawnsMin = 6;
  //   enemySpawnsFactor = 6;
  // } else if (onRound > 15 && onRound <= 20) {
  //   healthMin = 6;
  //   enemySpawnsMin = 7;
  //   enemySpawnsFactor = 4;
  // } else if (onRound > 20) {
  //   healthMin = 7;
  //   enemySpawnsMin = 5;
  //   enemySpawnsFactor = 4;
  // }

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
      // followPlayer: true,
      bulletDir: curBulletDir,
      canFire: true
    });

    enemies.push(newEnemy);
  }
}

function enemiesDefeated() {
  // experimental
  return enemies.length == 0;
}



function handlePlayerBullet(b){
  let enemyHasDied = false;

  // Enemy detection
  enemies.forEach((e) => {
    
    if (GameMath.circleCollision(e.x, e.y, e.size / 2.0, b.x, b.y, b.size/2.0)) {
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

  return !enemyHasDied;
} 

let enemyFiringSpd = 1.25;
let enemyBulletSpawnTime = 0.0;

function handleEnemies(){

  // Generates enemies
  enemies.forEach((e) => {
    
    // if the Enemy's canFire is true
    if (e.canFire) {
      if (millis() - enemyBulletSpawnTime > enemyFiringSpd * 1000.0) {
        let spd = 4.0;

        print(`${e} has fired.`);  
        enemyBullets.push(new Bullet(e.x, e.y, 0, -1, spd));
        // enemyBullets.push(new Bullet(e.x, e.y, 0, 1, spd));
        // enemyBullets.push(new Bullet(e.x, e.y, 1, 0, spd));
        // enemyBullets.push(new Bullet(e.x, e.y, -1, 0, spd));

        enemyBulletSpawnTime = millis();
      }
    }
    
    e.update();
    e.show();
  });
}
function draw() {
  background(0);
  noCursor();

  rectMode(CENTER);

  // Enemies defeated
  if (enemiesDefeated()) {
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
  enemyBullets = enemyBullets.filter((b) => { // 
    b.update();
    b.show();

    return !(b.offScreen());
  });

  // print(enemies);
  // Generate enemies
  handleEnemies();

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
