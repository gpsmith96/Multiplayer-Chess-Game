
const StartingPieces = [
  {
    type : "Pawn",
    owner : "Black",
    symbol : '\u265F',
    index : [8,9,10,11,12,13,14,15],
    vectors : [
        {X : 0, Y : 1, dist : 1, firstMove: 2, canAttack : "no"},
        {X : 1, Y : -1, dist : 1, canAttack : "only"},
        {X : -1, Y : -1, dist : 1, canAttack : "only"},
      ]
  },
  {
    type : "Rook",
    owner : "Black",
    symbol : '\u265C',
    index : [0, 7],
    vectors : [
        {X : 1, Y : 0, dist : 8, canAttack : "yes"},
        {X : -1, Y : 0, dist : 8, canAttack : "yes"},
        {X : 0, Y : 1, dist : 8, canAttack : "yes"},
        {X : 0, Y : -1, dist : 8, canAttack : "yes"},
      ]
  },
  {
    type : "Knight",
    owner : "Black",
    symbol : '\u265E',
    index : [1, 6],
    vectors : [
        {X : 2, Y : 1, dist : 1, canAttack : "yes"},
        {X : 2, Y : -1, dist : 1, canAttack : "yes"},
        {X : -2, Y : 1, dist : 1, canAttack : "yes"},
        {X : -2, Y : -1, dist : 1, canAttack : "yes"},
        {X : 1, Y : 2, dist : 1, canAttack : "yes"},
        {X : -1, Y : 2, dist : 1, canAttack : "yes"},
        {X : 1, Y : -2, dist : 1, canAttack : "yes"},
        {X : -1, Y : -2, dist : 1, canAttack : "yes"}
      ]
  },
  {
    type : "Bishop",
    owner : "Black",
    symbol : '\u265D',
    index : [2, 5],
    vectors : [
        {X : 1, Y : 1, dist : 8, canAttack : "yes"},
        {X : -1, Y : 1, dist : 8, canAttack : "yes"},
        {X : 1, Y : -1, dist : 8, canAttack : "yes"},
        {X : -1, Y : -1, dist : 8, canAttack : "yes"},
      ]
  },
  {
    type : "Queen",
    owner : "Black",
    symbol : '\u265B',
    index : [3],
    vectors : [
        {X : 1, Y : 1, dist : 8, canAttack : "yes"},
        {X : -1, Y : 1, dist : 8, canAttack : "yes"},
        {X : 1, Y : -1, dist : 8, canAttack : "yes"},
        {X : -1, Y : -1, dist : 8, canAttack : "yes"},
        {X : 1, Y : 0, dist : 8, canAttack : "yes"},
        {X : -1, Y : 0, dist : 8, canAttack : "yes"},
        {X : 0, Y : 1, dist : 8, canAttack : "yes"},
        {X : 0, Y : -1, dist : 8, canAttack : "yes"}
      ]
  },
  {
    type : "King",
    owner : "Black",
    symbol : '\u265A',
    index : [4],
    vectors : [
        {X : 1, Y : 1, dist : 1, canAttack : "yes"},
        {X : -1, Y : 1, dist : 1, canAttack : "yes"},
        {X : 1, Y : -1, dist : 1, canAttack : "yes"},
        {X : -1, Y : -1, dist : 1, canAttack : "yes"},
        {X : 1, Y : 0, dist : 1, canAttack : "yes"},
        {X : -1, Y : 0, dist : 1, canAttack : "yes"},
        {X : 0, Y : 1, dist : 1, canAttack : "yes"},
        {X : 0, Y : -1, dist : 1, canAttack : "yes"}
      ]
  },
  {
    type : "Pawn",
    owner : "White",
    symbol : '\u2659',
    index : [48,49,50,51,52,53,54,55],
    vectors : [
        {X : 0, Y : -1, dist : 1, firstMove: 2, canAttack : "no"},
        {X : 1, Y : -1, dist : 1, canAttack : "only"},
        {X : -1, Y : -1, dist : 1, canAttack : "only"},
      ]
  },
  {
    type : "Rook",
    owner : "White",
    symbol : '\u2656',
    index : [56, 63],
    vectors : [
        {X : 1, Y : 0, dist : 8, canAttack : "yes"},
        {X : -1, Y : 0, dist : 8, canAttack : "yes"},
        {X : 0, Y : 1, dist : 8, canAttack : "yes"},
        {X : 0, Y : -1, dist : 8, canAttack : "yes"},
      ]
  },
  {
    type : "Knight",
    owner : "White",
    symbol : '\u2658',
    index : [57, 62],
    vectors : [
        {X : 2, Y : 1, dist : 1, canAttack : "yes"},
        {X : 2, Y : -1, dist : 1, canAttack : "yes"},
        {X : -2, Y : 1, dist : 1, canAttack : "yes"},
        {X : -2, Y : -1, dist : 1, canAttack : "yes"},
        {X : 1, Y : 2, dist : 1, canAttack : "yes"},
        {X : -1, Y : 2, dist : 1, canAttack : "yes"},
        {X : 1, Y : -2, dist : 1, canAttack : "yes"},
        {X : -1, Y : -2, dist : 1, canAttack : "yes"}
      ]
  },
  {
    type : "Bishop",
    owner : "White",
    symbol : '\u2657',
    index : [58, 61],
    vectors : [
        {X : 1, Y : 1, dist : 8, canAttack : "yes"},
        {X : -1, Y : 1, dist : 8, canAttack : "yes"},
        {X : 1, Y : -1, dist : 8, canAttack : "yes"},
        {X : -1, Y : -1, dist : 8, canAttack : "yes"},
      ]
  },
  {
    type : "Queen",
    owner : "White",
    symbol : '\u2655',
    index : [59],
    vectors : [
        {X : 1, Y : 1, dist : 8, canAttack : "yes"},
        {X : -1, Y : 1, dist : 8, canAttack : "yes"},
        {X : 1, Y : -1, dist : 8, canAttack : "yes"},
        {X : -1, Y : -1, dist : 8, canAttack : "yes"},
        {X : 1, Y : 0, dist : 8, canAttack : "yes"},
        {X : -1, Y : 0, dist : 8, canAttack : "yes"},
        {X : 0, Y : 1, dist : 8, canAttack : "yes"},
        {X : 0, Y : -1, dist : 8, canAttack : "yes"}
      ]
  },
  {
    type : "King",
    owner : "White",
    symbol : '\u2654',
    index : [60],
    vectors : [
        {X : 1, Y : 1, dist : 1, canAttack : "yes"},
        {X : -1, Y : 1, dist : 1, canAttack : "yes"},
        {X : 1, Y : -1, dist : 1, canAttack : "yes"},
        {X : -1, Y : -1, dist : 1, canAttack : "yes"},
        {X : 1, Y : 0, dist : 1, canAttack : "yes"},
        {X : -1, Y : 0, dist : 1, canAttack : "yes"},
        {X : 0, Y : 1, dist : 1, canAttack : "yes"},
        {X : 0, Y : -1, dist : 1, canAttack : "yes"}
      ]
  }

]

export default StartingPieces