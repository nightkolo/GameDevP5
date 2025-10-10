const canSize = {x: 680, y: 680}

class Player {
  constructor(){
    this.x = 0.0;
    this.y = 0.0;
  }
  update(){
    this.x = mouseX;
    this.y = mouseY;
  }
  show(){
    square(this.x, this.y, 50.0);
  }
}
class Bullet {
  constructor(px, py, dirX = 0, dirY = -1, spd = 8.0){
    this.dirX = dirX;
    this.dirY = dirY;
    this.x = px;
    this.y = py;
    this.spd = spd;
    this.health = 1;

    this.size = 25.0;
  }
  update(){
    this.x += this.dirX * this.spd;
    this.y += this.dirY * this.spd;
  }
  show(){
    circle(this.x, this.y, this.size);
  }
  offScreen(){
    return (this.x > canSize.x || this.x < 0.0 || this.y > canSize.y || this.y < 0.0);
  }
  hitsCircle(cx, cy, r) {
    let dx = this.x - cx;
    let dy = this.y - cy;
    let distance = sqrt(dx * dx + dy * dy);

    // r is the radius of target circle, this.size/2 is bullet radius
    return distance < r + this.size/2;
  }
}
class Enemy {
  constructor(px = 200.0, py = 200.0, h = 10){
    this.x = px;
    this.y = py;
    this.health = h;
    this.size = this.health * 10.0;
  }
  update(){}
  show(){
    rectMode(CENTER);
    circle(this.x, this.y, this.size);
    text(`${this.health}`, this.x, this.y);
    textSize(40.0);
    textAlign(CENTER);
  }
  hit(){
    this.health--;
  }
  hasDied(){
    return (this.health < 1);
  }
  toString(){
    return `${this.health}, ${this.x}, ${this.y}`
  }
}

let p;
let e1;
let e2;
let e3;
let bullets = [];
let enemies = [];

function setup() {
  createCanvas(canSize.x, canSize.y);
  
  p = new Player();

  e1 = new Enemy();
  enemies.push(e1);
  
  e2 = new Enemy(400.0, 400.0);
  enemies.push(e2);
  
  e3 = new Enemy(600.0, 600.0);
  enemies.push(e3);
}

let lastSpawnTime = 0.0;
let firingSpdFactor = 0.125;

function draw() {
  background(0);
  noCursor();

  if (millis() - lastSpawnTime > firingSpdFactor * 1000.0) {
    bullets.push(new Bullet(p.x, p.y, curBulletDir.x, curBulletDir.y));
    lastSpawnTime = millis();
  }

  rectMode(CENTER);

  // Generate enemies
  enemies.forEach(e => {
    e.update();
    e.show();
  })

  // Handle bullets
  bullets = bullets.filter(b => {
    b.update();
    b.show();

    let hit = false;

    // Enemy detection
    enemies.forEach(e => {
      if (b.hitsCircle(e.x, e.y, e.size / 2.0, e.size)) {
        print(`Enemy ${e} is HIT by Bullet ${b.x}, ${b.y})`);

        e.hit();

        if (e.hasDied()){
          const index = enemies.indexOf(e);

          if (index > -1) {
            enemies.splice(index, 1);
          }
        }

        hit = true;
      }
    })

    return !hit && !(b.offScreen()); 
  });

  // player
  p.update();
  p.show();
}

let curBulletDir = {
  x: 0,
  y: -1   // default: up
}

function keyPressed(event){
  if (event.key === "ArrowUp" || event.key === "w" || event.key === "W"){
    curBulletDir.x = 0;
    curBulletDir.y = -1;
  } else if (event.key === "ArrowDown" || event.key === "s" || event.key === "S"){
    curBulletDir.x = 0;
    curBulletDir.y = 1;
  } else if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A"){
    curBulletDir.x = -1;
    curBulletDir.y = 0;
  } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D"){
    curBulletDir.x = 1;
    curBulletDir.y = 0;
  }
}
