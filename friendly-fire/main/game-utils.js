class Util {
  static EnemyTypes = {
    NORMAL: 0,
    SHOOTER: 1,
    EXPLODER: 2,
    SPRINTER: 3,
    REFLECTOR: 4,
  }
  static waves = [
  [ // 1
    { type: this.EnemyTypes.NORMAL, count: 3, hp: [3,5] }
  ],
  [ // 2
    { type: "NORMAL", count: 4, hp: [4,6] },
    { type: "REFLECTOR", count: 1, hp: [8,10] }
  ],
  [ // 3
    { type: "NORMAL", count: 3, hp: [3,5] }
  ],
  [ // 4
    { type: "NORMAL", count: 4, hp: [4,6] },
    { type: "REFLECTOR", count: 1, hp: [8,10] }
  ],
  [ // 5
    { type: "NORMAL", count: 3, hp: [3,5] }
  ],
  [ // 6
    { type: "NORMAL", count: 4, hp: [4,6] },
    { type: "REFLECTOR", count: 1, hp: [8,10] }
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