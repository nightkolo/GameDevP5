// Under construction

class Player {
  constructor(){
    this.x = 0.0;
    this.y = 0.0;
    this.size = 50.0
    this.enemies = [];
  }
  hit(){
    print("Ouch!");
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
    circle(this.x, this.y, this.size);
  }
}