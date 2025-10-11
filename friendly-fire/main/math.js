class GameMath {
  static circleCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (r1 + r2);
  }
  static hitsCircle(cx, cy, r) {
    let dx = this.x - cx;
    let dy = this.y - cy;
    let distance = sqrt(dx * dx + dy * dy);

    // r is the radius of target circle, this.size/2 is bullet radius
    return distance < r + this.size/2;
  }
}