class Item {
  constructor(x, y, item, player){
    this.x = x;
    this.y = y;
    this.item = item;
    this.player = player;
    
    this.hitsToGet = 15;
    this.size = 50.0;
    
    this.moveX = random() > 1/2;
    this.dir = Math.sign(random()-0.5);
    this.spd = 1.125;

    this.collected = false;
  }
  isCollected(){
    return this.hitsToGet < 1;
  }
  hit(){
    if (this.collected) return; 

    print("item hit");

    this.hitsToGet--;
    if (this.isCollected()){
      this.grantItem();
      
      this.collected = true;
    }
  }
  grantItem(){
    this.player.getItem(this.item);
  }
  update(){
    if (this.moveX){
      this.x += this.spd * this.dir;
    } else {
      this.y += this.spd * this.dir;
    }
  }
  show(){
    circle(this.x, this.y, this.size);
  }
}