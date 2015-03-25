var map3 = {
  layout: [
    '1'.repeat(10) + '0'.repeat(10),
    '0'.repeat(9) + '1'  + '0'.repeat(10),
    '0'.repeat(9) + '1' + '0'.repeat(10),
    '0'.repeat(9) + '1' + '0'.repeat(10),
    '0'.repeat(9) + '1' + '0'.repeat(10),
    '0'.repeat(9) + '1' + '0'.repeat(10),
    '0'.repeat(9) + '1'
  ],
  rules: function(board) { board.makeUnit(0, 0); }
}

var map4 = {
  layout: (function() {
    // var layout = new Array(9);
    // for (var i = 0; i < layout.length; i++)
    //   layout[i] = '1'.repeat(layout.length);
    var layout = [
      '11111', '11111', '11111', '11111', '11111',
      '11111', '11111', '11111', '11111'
    ];
    return layout;
  }()),
  rules: function(board) {
    board.makeUnit(2, 4);
    board.makeRoom(1, 1, 3, 3);
    board.makeRoom(1, 5, 3, 7);
    board.makeDoor(0, 2, 1, 2, 'open');
    board.makeDoor(0, 6, 1, 6);
    board.makeUnit(3, 3, 'foe');
    board.makeUnit(2, 6, 'foe');
    board.makeFurniture(2, 2, 2, 3);
  }
};

var map5 = {
  layout: [
    '1'.repeat(20), '01'.repeat(10), '1'.repeat(20), '1'.repeat(20),
    '0' + '1100'.repeat(4) + '110', '0' + '1100'.repeat(4) + '110',
    '1'.repeat(20), '1'.repeat(20)
  ],
  rules: function(board) {
    board.makeUnit(0, 0);
  }
};

// line of sight design
// number of adjacent tiles determines how lit the the partial lit
// tile should be
// diagonal adjacency allowed
var map6 = {
  layout: [
    '111', '011', '111', '111'
  ],
  rules: function(board) {
    board.makeUnit(0, 0);
    var lit3 = '.5', lit1 = '.3', lit0 = '.0';
    document.getElementById('tile-1-2').style.strokeOpacity = lit3;
    document.getElementById('tile-1-2').style.fillOpacity = lit3;
    document.getElementById('tile-2-3').style.strokeOpacity = lit3;
    document.getElementById('tile-2-3').style.fillOpacity = lit3;
    document.getElementById('tile-0-2').style.strokeOpacity = lit1;
    document.getElementById('tile-0-2').style.fillOpacity = lit1;
    document.getElementById('tile-1-3').style.strokeOpacity = lit1;
    document.getElementById('tile-1-3').style.fillOpacity = lit1;
    document.getElementById('tile-0-3').style.strokeOpacity = lit0;
    document.getElementById('tile-0-3').style.fillOpacity = lit0;
  }
};

// USE THIS ONE
// line of sight design
// only straight horiz/vert adjacency counts
var map7 = {
  layout: [
    '111', '011', '111', '111'
  ],
  rules: function(board) {
    // board.makeUnit(0, 0);
    var lit2 = '.3', lit1 = '.3', lit0 = '.0';
    document.getElementById('tile-1-2').style.strokeOpacity = lit2;
    document.getElementById('tile-1-2').style.fillOpacity = lit2;
    document.getElementById('tile-2-3').style.strokeOpacity = lit1;
    document.getElementById('tile-2-3').style.fillOpacity = lit1;
    document.getElementById('tile-0-2').style.strokeOpacity = lit0;
    document.getElementById('tile-0-2').style.fillOpacity = lit0;
    document.getElementById('tile-1-3').style.strokeOpacity = lit0;
    document.getElementById('tile-1-3').style.fillOpacity = lit0;
    document.getElementById('tile-0-3').style.strokeOpacity = lit0;
    document.getElementById('tile-0-3').style.fillOpacity = lit0;
  }
};
