// Under construction

class Player {
  constructor(){
    this.x = 0.0;
    this.y = 0.0;
    this.size = 50.0
    
    this.lives = 5;
    this.alive = true;
  }
  hit(){
    print("Ouch!");

    this.lives--;
    
    if (this.lives < 1) {
      this.die();
    }
  }
  die(){
    // TODO Player death incomplete
    this.alive = false;
  }
  insideAnEnemy(){
    // TODO move enemy detection logic here
    // return GameMath.circleCollision(
    //   this.player.x,
    //   this.player.y,
    //   this.player.size / 2.0,
    //   this.x,
    //   this.y,
    //   this.getSize() / 2.0
    // );
  }
  update(){
    this.x = mouseX;
    this.y = mouseY;
  }
  show(){
    fill(255, 255, 200);

    // TODO make into square
    circle(this.x, this.y, this.size);

    fill(255);
    strokeWeight(3);
    stroke(0)
    textSize(25.0);
    textAlign(CENTER);

    text(`${this.lives}`, this.x, this.y + 8.0);
  }
}