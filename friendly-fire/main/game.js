class Game {
  static EnemyTypes = {
    NORMAL: 0,
    SHOOTER: 1,
    EXPLODER: 2,
    SPRINTER: 3,
    REFLECTOR: 4,
  };
  // type: Enemy Type
  // count: quantity of the Enemy
  // hp: Random health point around interval

  static waves = [
    [
      // 1
      { type: this.EnemyTypes.NORMAL, count: 3, hp: [3, 5] },
    ],
    [
      // 2
      { type: this.EnemyTypes.NORMAL, count: 2, hp: [8, 10] },
      { type: this.EnemyTypes.SHOOTER, count: 1, hp: [3, 6] }
    ],
    [
      // 3
      { type: this.EnemyTypes.NORMAL, count: 3, hp: [8, 10] },
      { type: this.EnemyTypes.SHOOTER, count: 1, hp: [6, 9] }
    ],
    [
      // 4
      { type: this.EnemyTypes.NORMAL, count: 3, hp: [8, 10] },
      { type: this.EnemyTypes.REFLECTOR, count: 2, hp: [10, 15] }
    ]
  ];
  // static EnemyTypes = Object.freeze({
  //   NORMAL: 0,
  //   SHOOTER: 1,
  //   EXPLODER: 2,
  //   SPRINTER: 3,
  //   REFLECTOR: 4,
  // });
}
