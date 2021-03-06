var map = {
  layout: [
    "011111111111000000",
    "111111111111000000",
    "111111111111000000",
    "111111111111000000",
    "111111111111000000",
    "111111111111111110",
    "111111111111111110",
    "111111111111111110",
    "111111111111111110",
    "111110000111111110",
    "111110000111111110",
    "111110000111111110",
    "111111111111111111",
    "111111111111111111",
    "111111111111111111",
    "111111111111111111",
    "111111111111111111",
    "111111111111110000"
  ],

  rules: function(board) {
    board.makeRoom(1, 0, 4, 2);
    board.makeRoom(5, 0, 8, 2);
    board.makeRoom(9, 0, 11, 4);
    board.makeRoom(1, 9, 4, 12);
    board.makeRoom(1, 3, 4, 7);
    board.makeRoom(5, 3, 8, 7);
    board.makeRoom(1, 13, 4, 16);
    board.makeRoom(5, 12, 8, 16);
    board.makeRoom(9, 12, 11, 16);
    board.makeRoom(14, 12, 17, 16);
    board.makeRoom(10, 6, 15, 10);
    board.makeFurniture(10, 0, 11, 2);
    board.makeFurniture(10, 4, 10, 4);
    board.makeFurniture(1, 4, 2, 6);
    board.makeFurniture(6, 4, 8, 5);
    board.makeFurniture(3, 9, 4, 11);
    board.makeFurniture(5, 12, 7, 12);
    board.makeFurniture(5, 14, 6, 16);
    board.makeFurniture(11, 14, 11, 16);
    board.makeFurniture(15, 12, 17, 12);
    board.makeFurniture(15, 16, 17, 16);
    board.makeFurniture(17, 15, 17, 15);
    board.makeFurniture(11, 8, 13, 9);
    board.makeFurniture(12, 6, 14, 6);
    board.makeFurniture(11, 6, 11, 6);
    board.makeFurniture(10, 7, 10, 7);
    board.makeDoor(3, 2, 3, 3);
    board.makeDoor(4, 1, 5, 1);
    board.makeDoor(8, 1, 9, 1);
    board.makeDoor(3, 7, 3, 8);
    board.makeDoor(0, 10, 1, 10);
    board.makeDoor(3, 16, 3, 17);
    board.makeDoor(7, 16, 7, 17);
    board.makeDoor(8, 14, 9, 14);
    board.makeDoor(10, 11, 10, 12);
    board.makeDoor(13, 14, 14, 14);
    board.makeDoor(7, 7, 7, 8);
    board.makeDoor(16, 8, 15, 8);
    board.makeUnit(2, 14);
    board.makeUnit(1, 14);
    board.makeUnit(2, 13);
    board.makeUnit(2, 1, 'foe');
    board.makeUnit(3, 1, 'foe');
    board.makeUnit(6, 0, 'foe');
    board.makeUnit(6, 1, 'foe');
    board.makeUnit(6, 2, 'foe');
    board.makeUnit(9, 0, 'foe');
    board.makeUnit(9, 2, 'foe');
    board.makeUnit(9, 3, 'foe');
    board.makeUnit(3, 5, 'foe');
    board.makeUnit(4, 4, 'foe');
    board.makeUnit(6, 6, 'foe');
    board.makeUnit(7, 6, 'foe');
    board.makeUnit(2, 10, 'foe');
    board.makeUnit(2, 11, 'foe');
    board.makeUnit(7, 13, 'foe');
    board.makeUnit(8, 14, 'foe');
    board.makeUnit(10, 13, 'foe');
    board.makeUnit(10, 15, 'foe');
    board.makeUnit(16, 14, 'foe');
    board.makeUnit(15, 15, 'foe');
    board.makeUnit(14, 7, 'foe');
    board.makeUnit(11, 10, 'foe');
    board.makeUnit(14, 10, 'foe');
    board.makeUnit(12, 7, 'foe');
  }
}
