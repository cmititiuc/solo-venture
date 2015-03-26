var initBoard = function(document) {
  var pub = {};
  var document = typeof document !== 'undefined' ? document : window.document;
  var viewport = document.getElementById('viewport');
  viewportWidth = viewport.width.baseVal.value;
  viewportHeight = viewport.height.baseVal.value;
  var svgns = "http://www.w3.org/2000/svg";
  var svgDocument = document.getElementById('viewport').ownerDocument;
  var playerTurn = 0;

  function coord(axis, value) {
    if (axis == "x") {
      return (viewportWidth / 2 - tileWidth * (map.layout[0].length / 2)
        + (tileWidth + 1) * value - tileWidth / 4 - 1);
    } else if (axis == "y") {
      return (viewportHeight / 2 - tileHeight * (map.layout.length / 2)
        + (tileHeight + 1) * value - tileHeight / 4 - 1);
    } else {
      console.log("Axis " + axis + "not recognized.");
    }
  }

  function makeMark(x, y) {
    var target = document.getElementById('tile-' + x + '-' + y);
    var x = target.x.baseVal.value;
    var y = target.y.baseVal.value;

    var shape = svgDocument.createElementNS(svgns, "line");
    shape.setAttributeNS(null, "x1", x + tileWidth / 4);
    shape.setAttributeNS(null, "y1", y + tileWidth / 4);
    shape.setAttributeNS(null, "x2", x + tileWidth * .75);
    shape.setAttributeNS(null, "y2", y + tileHeight * .75);
    shape.setAttributeNS(null, "stroke-width", "2");
    shape.setAttributeNS(null, "stroke", "black");

    document.getElementById('viewport').appendChild(shape);

    var shape = svgDocument.createElementNS(svgns, "line");
    shape.setAttributeNS(null, "x1", x + tileWidth * .75);
    shape.setAttributeNS(null, "y1", y + tileWidth / 4);
    shape.setAttributeNS(null, "x2", x + tileWidth / 4);
    shape.setAttributeNS(null, "y2", y + tileHeight * .75);
    shape.setAttributeNS(null, "stroke-width", "2");
    shape.setAttributeNS(null, "stroke", "black");

    document.getElementById('viewport').appendChild(shape);
  }

  function sameRoom(node, target) {
    var node_room = node.getAttribute('data-room');
    return node_room == target.getAttribute('data-room');
  }

  function adjacent(x1, y1, x2, y2) {
    // console.log('x1: ' + x1 + ' y1: ' + y1 + ' x2: ' + x2 + ' y2: ' + y2);
    return false;
  }

  function resetTiles() {
    var path = document.getElementsByClassName('path');
    while (path.length != 0) {
      path[0].setAttribute('class', 'tile');
    }
    var probed = document.getElementsByClassName('probed');
    while (probed.length != 0) {
      probed[0].setAttribute('class', 'tile');
    }
  }

  function markTile(x, y, className) {
    var id = 'tile-' + x + '-' + y;
    var target = document.getElementById(id);
    target.setAttribute('class', className);
  }

  function drawRange(id, range) {
    var player = document.getElementById(id);
    var x = player.getAttribute("data-x");
    var y = player.getAttribute("data-y");
    var source = document.getElementById('tile-' + x + '-' + y);
    source.setAttribute('class', 'probed');
    var q = [];
    var range = typeof range !== 'undefined' ? range : 0;
    q.push([x, y, []]);
    probe([x, y, []], x, y);

    function probe(v, x, y) {
      var node = document.getElementById('tile-' + v[0] + '-' + v[1]);
      var target = document.getElementById('tile-' + x + '-' + y);
      // console.log('range: ' + range + ' v[2].length: ' + v[2].length);
      if (target && (range == 0 || v[2].length < range)) {
        var occupied = target.getAttribute('data-occupied');
        occupied = occupied && occupied != 'friendly';
        if (!occupied && !doorBetween(v[0], v[1], x, y, 'closed')) {
          if (sameRoom(node, target) || doorBetween(v[0], v[1], x, y, 'open')) {
            if (target.getAttribute('class') !== "probed") {
              var history = v[2].slice();
              history.push([ v[0], v[1] ]);
              q.push([ x, y, history ]);
              target.setAttribute('class', 'probed');
            }
          }
        }
      }
    }

    // (function step() {
      // if (q.length !== 0) {
      while (q.length !== 0) {
        var v = q.shift();
        var id = 'tile-' + v[0] + '-' + v[1];
        var node = document.getElementById(id);

        probe(v, v[0]     , +v[1] - 1); // north
        probe(v, v[0]     , +v[1] + 1); // south
        probe(v, +v[0] + 1, v[1]     ); // east
        probe(v, +v[0] - 1, v[1]     ); // west

        // if (found == false) setTimeout(step, 1);
      }
    // })();
  }

  function lightRoom(id) {
    var firstCoords = id.match(/[0-9]+-[0-9]+/)[0];
    var secondCoords = id.match(/[0-9]+-[0-9]+$/)[0];
    var x1 = +(firstCoords.match(/[0-9]+/)[0]);
    var y1 = +(firstCoords.match(/[0-9]+$/)[0]);
    var x2 = +(secondCoords.match(/[0-9]+/)[0]);
    var y2 = +(secondCoords.match(/[0-9]+$/)[0]);
    console.log('x1: ' + x1 + ' y1: ' + y1 + ' x2: ' + x2 + ' y2: ' + y2);

    for (var i = x1; i <= x2; i++) {
      for (var j = y1; j <= y2; j++) {
        var id = 'tile-' + i + '-' + j;
        var tile = document.getElementById(id);
        if (tile) {
          debug ? tile.style.opacity = '1' : tile.style.display = '';
          var doors = getDoors(tile);
          for (var k = 0; k < doors.length; k++) {
            debug ? doors[k].style.opacity = '1' : doors[k].style.display = '';
          }
        } else {
          // furniture or blank space?
            // if furniture, light up whole furniture
            // if blank space, ignore
        }
      }
    }
    // light up room border
    var id = 'room-' + x1 + '-' + y1 + '-' + x2 + '-' + y2;
    var room = document.getElementById(id);
    debug ? room.style.opacity = '1' : room.style.display = '';
  }

  function updateMap() {
    var player = document.getElementsByClassName('player')[playerTurn];
    if (!player) {
      console.log(this.id.match(/[0-9]+/) + ', ' + this.id.match(/[0-9]+$/));
      return;
    }
    var playerX = player.getAttribute('data-x');
    var playerY = player.getAttribute('data-y');
    var className = this.getAttribute('class');
    
    if (className == 'door') {
      var id = this.getAttribute('id');
      var firstCoords = id.match(/[0-9]+-[0-9]+/)[0];
      var secondCoords = id.match(/[0-9]+-[0-9]+$/)[0];
      var x1 = firstCoords.match(/[0-9]+/)[0];
      var y1 = firstCoords.match(/[0-9]+$/)[0];
      var x2 = secondCoords.match(/[0-9]+/)[0];
      var y2 = secondCoords.match(/[0-9]+$/)[0];
      // console.log('x1: ' + x1 + ' y1: ' + y1 + ' x2: ' + x2 + ' y2: ' + y2);
      if ((playerX == x1 && playerY == y1) || (playerX == x2 && playerY == y2)) {
        if (this.getAttribute('data-state') == 'open') {
          this.setAttribute('data-state', 'closed');
          this.style.stroke = 'red';
        } else {
          this.setAttribute('data-state', 'open');
          this.style.stroke = 'green';
          var id = 'tile-' + x1 + '-' + y1;
          var tile1 = document.getElementById(id);
          if (tile1) {
            debug ? tile1.style.opacity = '1' : tile1.style.display = '';
            var roomId = tile1.getAttribute('data-room');
            if (roomId) lightRoom(roomId);
          }
          var id = 'tile-' + x2 + '-' + y2;
          var tile2 = document.getElementById(id);
          if (tile2) {
            debug ? tile2.style.opacity = '1' : tile2.style.display = '';
            var roomId = tile2.getAttribute('data-room');
            if (roomId) lightRoom(roomId);
          }
        }
      }
    }

    var occupied = this.getAttribute('data-occupied');
    if ((!occupied || occupied.length == 0)) {
      if (className == 'probed') {
        var x = this.id.match(/[0-9]+/);
        var y = this.id.match(/[0-9]+$/);
        var id = 'tile-' + playerX + '-' + playerY;
        var source = document.getElementById(id);
        resetTiles(); // must reset before pathLength because my
        // pathing algos use the class of the tile to save state.
        // Might want to do this differently in the future.
        var pathLength = getPathLength(playerX, playerY, x, y);

        // console.log('target x: ' + x + ' y: ' + y);
        // console.log('source x: ' + playerX + ' y: ' + playerY);
        // console.log(player.getAttribute('transform'));
        player.setAttribute("transform", "translate("
          + x * (tileWidth + 1) + ", " + y * (tileHeight + 1) + ")");
        // console.log(player.getAttribute('transform'));
        this.setAttribute('data-occupied', 'friendly');
        source.setAttribute('data-occupied', '');
        player.setAttributeNS(null, "data-x", x);
        player.setAttributeNS(null, "data-y", y);
        var moveRoll = (Math.floor(Math.random() * 6) + 1)
                       + (Math.floor(Math.random() * 6) + 1);
        var moveDisplay = document.getElementById('movement-display');
        if (+moveDisplay.innerHTML - pathLength == 0) {
          moveDisplay.innerHTML = moveRoll;
          var noPlayers = document.getElementsByClassName('player').length;
          playerTurn = (playerTurn + 1) % noPlayers;
        } else
          moveDisplay.innerHTML = +moveDisplay.innerHTML - pathLength;
      }
      resetTiles();
      showVisible(player);

      drawRange('player-' + (+playerTurn + 1),
        document.getElementById('movement-display').innerHTML);
    }
  }

  function doorBetween(x1, y1, x2, y2, state) {
    if (x1 == x2) {
      var temp = Math.min(y1, y2);
      var y2 = Math.max(y1, y2);
      y1 = temp;
    } else {
      var temp = Math.min(x1, x2);
      var x2 = Math.max(x1, x2);
      x1 = temp;
    }
    var id = 'door-' + x1 + '-' + y1 + '-' + x2 + '-' + y2;
    var door = document.getElementById(id);
    if (door && door.getAttribute('data-state') == state)
      return true;
    else
      return false;
  }

  function makeMovementDisplay() {
    var moveRoll = (Math.floor(Math.random() * 6) + 1)
                   + (Math.floor(Math.random() * 6) + 1);
    var data = svgDocument.createTextNode(moveRoll.toString());
    var text = svgDocument.createElementNS(svgns, "text");
    text.style.fontSize = "15px";
    text.style.fontWeight = "bold";
    text.setAttributeNS(null, "x", 15);
    text.setAttributeNS(null, "y", viewportHeight - 5);
    text.setAttributeNS(null, "fill", "black");
    text.setAttributeNS(null, "text-anchor", "middle");
    text.setAttributeNS(null, "id", "movement-display");
    text.appendChild(data);
    document.getElementById('viewport').appendChild(text);
  }

  function getPathLength(x1, y1, x2, y2) {
    var source = document.getElementById('tile-' + x1 + '-' + y1);
    source.setAttribute('class', 'probed');
    var q = [];
    var found = false;
    var range = typeof range !== 'undefined' ? range : 0;
    var pathLength;
    q.push([x1, y1, []]);
    probe([x1, y1, []], x1, y1);

    function find(v, x, y) {
      if (x == x2 && y == y2) {
        found = true;
        q = []; // only need if running as while loop
        pathLength = v[2].length
      }
    }

    function probe(v, x, y) {
      var node = document.getElementById('tile-' + v[0] + '-' + v[1]);
      var target = document.getElementById('tile-' + x + '-' + y);
      if (target && (range == 0 || v[2].length <= range)) {
        var occupied = target.getAttribute('data-occupied');
        occupied = occupied && occupied != 'friendly';
        if (!occupied && !doorBetween(v[0], v[1], x, y, 'closed')) {
          if (sameRoom(node, target) || doorBetween(v[0], v[1], x, y, 'open')) {
            find(v, x, y);
            if (found == false && target.getAttribute('class') !== "probed") {
              var history = v[2].slice();
              history.push([ v[0], v[1] ]);
              q.push([ x, y, history ]);
              target.setAttribute('class', 'probed');
            }
          }
        }
      }
    }

    // (function step() {
      // if (q.length !== 0) {
      while (q.length !== 0) {
        var v = q.shift();
        var id = 'tile-' + v[0] + '-' + v[1];
        var node = document.getElementById(id);

        probe(v, v[0]     , +v[1] - 1); // north
        probe(v, v[0]     , +v[1] + 1); // south
        probe(v, +v[0] + 1, v[1]     ); // east
        probe(v, +v[0] - 1, v[1]     ); // west

        // if (found == false) setTimeout(step, 1);
      }
    // })();
    return pathLength + 1;
  }

  function drawShortestPath(x1, y1, x2, y2, range) {
    var source = document.getElementById('tile-' + x1 + '-' + y1);
    source.setAttribute('class', 'probed');
    var q = [];
    var found = false;
    var range = typeof range !== 'undefined' ? range : 0;
    q.push([x1, y1, []]);
    probe([x1, y1, []], x1, y1);

    function find(v, x, y) {
      if (x == x2 && y == y2) {
        found = true;
        q = []; // only need if running as while loop
        for (var i = 0; i < v[2].length; i++) {
          markTile(v[2][i][0], v[2][i][1], 'path');
        }
        markTile(x2, y2, 'path');
        markTile(v[0], v[1], 'path');
      }
    }

    function probe(v, x, y) {
      var node = document.getElementById('tile-' + v[0] + '-' + v[1]);
      var target = document.getElementById('tile-' + x + '-' + y);
      if (target && (range == 0 || v[2].length <= range)) {
        var occupied = target.getAttribute('data-occupied');
        occupied = occupied && occupied != 'friendly';
        if (!occupied && !doorBetween(v[0], v[1], x, y, 'closed')) {
          if (sameRoom(node, target) || doorBetween(v[0], v[1], x, y, 'open')) {
            find(v, x, y);
            if (found == false && target.getAttribute('class') !== "probed") {
              var history = v[2].slice();
              history.push([ v[0], v[1] ]);
              q.push([ x, y, history ]);
              target.setAttribute('class', 'probed');
            }
          }
        }
      }
    }

    // (function step() {
      // if (q.length !== 0) {
      while (q.length !== 0) {
        var v = q.shift();
        var id = 'tile-' + v[0] + '-' + v[1];
        var node = document.getElementById(id);

        probe(v, v[0]     , +v[1] - 1); // north
        probe(v, v[0]     , +v[1] + 1); // south
        probe(v, +v[0] + 1, v[1]     ); // east
        probe(v, +v[0] - 1, v[1]     ); // west

        // if (found == false) setTimeout(step, 1);
      }
    // })();
  }

  function getDoors(tile) {
    var id = tile.getAttribute('id');
    var x = id.match(/[0-9]+/);
    var y = id.match(/[0-9]+$/);
    var doors = [];

    id = 'door-' + (+x - 1) + '-' + y + '-' + x + '-' + y;
    if (door = document.getElementById(id)) doors.push(door);
    id = 'door-' + x + '-' + (+y - 1) + '-' + x + '-' + y;
    if (door = document.getElementById(id)) doors.push(door);
    id = 'door-' + x + '-' + y + '-' + (+x + 1) + '-' + y;
    if (door = document.getElementById(id)) doors.push(door);
    id = 'door-' + x + '-' + y + '-' + x + '-' + (+y + 1);
    if (door = document.getElementById(id)) doors.push(door);

    return doors;
  }

  pub.makeRectangle = function(x, y) {
    var shape = svgDocument.createElementNS(svgns, "rect");
    shape.setAttributeNS(null, "x", coord('x', x));
    shape.setAttributeNS(null, "y", coord('y', y));
    shape.setAttributeNS(null, "width",  tileWidth);
    shape.setAttributeNS(null, "height", tileHeight);
    shape.setAttributeNS(null, "class", "tile");
    shape.setAttributeNS(null, "id", "tile-" + x + "-" + y);
    debug ? shape.style.opacity = '.2' : shape.style.display = 'none';
    
    document.getElementById('viewport').appendChild(shape);
  }

  /* TODO: I did this wrong.  Params should be (x, y, width, height).
     Same for makeFurniture(). */
  pub.makeRoom = function (x1, y1, x2, y2) {
    var shape = svgDocument.createElementNS(svgns, "rect");
    shape.setAttributeNS(null, "x", coord('x', Math.min(x1, x2)));
    shape.setAttributeNS(null, "y", coord('y', Math.min(y1, y2)));
    shape.setAttributeNS(null, "width",
      (Math.abs(x1 - x2) + 1) * (tileWidth + 1) - 1);
    shape.setAttributeNS(null, "height",
      (Math.abs(y1 - y2) + 1) * (tileHeight + 1) - 1);
    shape.setAttributeNS(null, "class", "room");
    shape.setAttribute('id', 'room-' + x1 + '-' + y1 + '-' + x2 + '-' + y2);
    debug ? shape.style.opacity = '.2' : shape.style.display = 'none';
    
    document.getElementById('viewport').appendChild(shape);
    
    // set data-room attributes for all tiles in the room
    var id = 'room-' + x1 + '-' + y1 + '-' + x2 + '-' + y2;
    for (var i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
      for (var j = Math.min(y1, y2); j <= Math.max(y1, y2); j++) {
        var target = document.getElementById('tile-' + i + '-' + j);
        target.setAttribute('data-room', id);
      }
    }
  }

  pub.makeUnit = function(x, y, iff) {
    var target = document.getElementById('tile-' + x + '-' + y);
    var cx = target.x.baseVal.value;
    var cy = target.y.baseVal.value;
    var iff = typeof iff !== 'undefined' ? iff : 'friendly';
    target.setAttribute('data-occupied', iff);

    var shape = svgDocument.createElementNS(svgns, "circle");
    shape.setAttributeNS(null, "cx", coord('x', 0) + tileWidth / 2);
    shape.setAttributeNS(null, "cy", coord('y', 0) + tileHeight / 2);
    shape.setAttributeNS(null, "r", "10");

    var symbol;
    if (iff == 'friendly')
      symbol = document.getElementsByClassName('player').length + 1;
    else {
      var options = ['!', '@', '#', '$', '%', '^', '&', '*'];
      symbol = options[Math.floor(Math.random() * options.length)];
    }

    var data = svgDocument.createTextNode(symbol);

    var text = svgDocument.createElementNS(svgns, "text");
    text.style.fontSize = "15px";
    text.style.fontWeight = "bold";
    text.setAttributeNS(null, "x", coord('x', 0) + tileWidth / 2);
    text.setAttributeNS(null, "y", coord('y', 0) + tileHeight / 2 + 5);
    text.setAttributeNS(null, "fill", "#F1E9D2");
    text.setAttributeNS(null, "text-anchor", "middle");
    text.appendChild(data);

    var group = document.createElementNS("http://www.w3.org/2000/svg","g");
    group.setAttribute("class", iff == 'friendly' ? "player" : "enemy");
    if (iff != 'friendly')
      debug ? group.style.opacity = '.2' : group.style.display = 'none';
    group.setAttribute("id", "player-" + symbol);
    group.setAttributeNS(null, "data-x", x);
    group.setAttributeNS(null, "data-y", y);
    group.appendChild(shape);
    group.appendChild(text);

    group.setAttribute("transform", "translate("
      + x * (tileWidth + 1) + ", " + y * (tileHeight + 1) + ")");
    document.getElementById('viewport').appendChild(group);
  }

  pub.makeDoor = function(x1, y1, x2, y2, state) {
    // TODO: test to make sure tiles are adjacent
    var orientation = 'horizontal';
    var state = typeof state !== 'undefined' ? state : 'closed';
    if (y1 == y2) orientation = 'vertical';

    if (x1 == x2) {
      var temp = Math.min(y1, y2);
      var y2 = Math.max(y1, y2);
      y1 = temp;
    } else {
      var temp = Math.min(x1, x2);
      var x2 = Math.max(x1, x2);
      x1 = temp;
    }

    var shape = svgDocument.createElementNS(svgns, "line");
    if (orientation == 'horizontal') {
      shape.setAttributeNS(null, "x1", coord('x', x1));
      shape.setAttributeNS(null, "y1", coord('y', Math.max(y1, y2)));
      shape.setAttributeNS(null, "x2", coord('x', x1) + tileWidth);
      shape.setAttributeNS(null, "y2", coord('y', Math.max(y1, y2)));
    } else {
      shape.setAttributeNS(null, "x1", coord('x', Math.max(x1, x2)));
      shape.setAttributeNS(null, "y1", coord('y', y1));
      shape.setAttributeNS(null, "x2", coord('x', Math.max(x1, x2)));
      shape.setAttributeNS(null, "y2", coord('y', y1) + tileHeight);
    }
    shape.setAttributeNS(null, "stroke-width", "4");
    shape.setAttributeNS(null, "data-state", state);
    shape.setAttributeNS(null, "class", "door");
    var id = "door-" + x1 + '-' + y1 + '-' + x2 + '-' + y2;
    shape.setAttributeNS(null, "id", id);
    debug ? shape.style.opacity = '.2' : shape.style.display = 'none';
    if (state == 'open')
      shape.setAttributeNS(null, "stroke", "green");
    else
      shape.setAttributeNS(null, "stroke", "red");

    document.getElementById('viewport').appendChild(shape);
  }

  pub.makeFurniture = function (x1, y1, x2, y2) {
    if (x1 == x2) {
      var temp = Math.min(y1, y2);
      var y2 = Math.max(y1, y2);
      y1 = temp;
    } else {
      var temp = Math.min(x1, x2);
      var x2 = Math.max(x1, x2);
      x1 = temp;
    }

    var shape = svgDocument.createElementNS(svgns, "rect");
    shape.setAttributeNS(null, "x", coord('x', x1) + tileWidth * .10);
    shape.setAttributeNS(null, "y", coord('y', y1) + tileHeight * .10);
    shape.setAttributeNS(null, "width",
      tileWidth * (Math.abs(x1 - x2) + 1) - tileWidth * .20);
    shape.setAttributeNS(null, "height",
      tileHeight * (Math.abs(y1 - y2) + 1) - tileHeight * .20);
    shape.setAttributeNS(null, "class", "furniture");
    debug ? shape.style.opacity = '.2' : shape.style.display = 'none';
    // shape.setAttributeNS(null, "id", "");
    
    document.getElementById('viewport').appendChild(shape);

    // remove the ids so they're not used in pathfinding
    for (var i = x1; i <= x2; i++) {
      for (var j = y1; j <= y2; j++) {
        var tile = document.getElementById('tile-' + i + '-' +j);
        tile.setAttribute('id', '');
        tile.removeEventListener('click', updateMap);
      }
    }
  }

  pub.makeTiles = function(map) {
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[0].length; j++) {
        if (map[i][j] != 0) pub.makeRectangle(j, i);
      }
    }
  }

  pub.drawLine = function(x1, y1, x2, y2) {
    // var svgns = "http://www.w3.org/2000/svg";
    // var svgDocument = document.getElementById('viewport').ownerDocument;
    // var shape = svgDocument.createElementNS(svgns, "line");
    // shape.setAttributeNS(null, "x1", coord('x', x1) + tileWidth / 2);
    // shape.setAttributeNS(null, "y1", coord('y', y1) + tileHeight / 2);
    // shape.setAttributeNS(null, "x2", coord('x', x2) + tileWidth / 2);
    // shape.setAttributeNS(null, "y2", coord('y', y2) + tileHeight / 2);
    // shape.setAttributeNS(null, "stroke-width", "1");
    // shape.setAttributeNS(null, "stroke", "blue");
    // document.getElementById('viewport').appendChild(shape);

    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var error = 0;
    var deltaErr = Math.abs(deltaY / deltaX);
    var y = y1;
    function mark(x, y, error) {
      var tile = document.getElementById('tile-' + i + '-' + y);
      if (tile) {
        tile.setAttribute('class', 'probed');
        console.log('tile ' + i + ' ' + y + ' found error: ' + error);
        return true;
      } else {
        console.log('tile not found error: ' + error);
        //   tile = document.getElementById('tile-' + i + '-' + (+y - 1));
        //   if (tile) {
        //     tile.setAttribute('class', 'probed');
        //     return true;
        //   }
        // } else {
          console.log('LOS blocked');
          return false;
        // }
      }
    }
    for (var i = 0; i <= x2 - x1; i++) { // 0, 1, 2
      if (mark(i, y, error) == false) return;
      error = error + deltaErr;
      console.log('error: ' + error);
      while (error >= 0.6) {
        if (mark(i, y, error) == false) return;
        y = y + (y2 - y1 < 0 ? -1 : 1);
        error = error - 1.0;
      }
    }
  }

  pub.calcStraightLine = function(x1, y1, x2, y2) {
    var shape = svgDocument.createElementNS(svgns, "line");
    shape.setAttributeNS(null, "x1", coord('x', x1) + tileWidth / 2);
    shape.setAttributeNS(null, "y1", coord('y', y1) + tileHeight / 2);
    shape.setAttributeNS(null, "x2", coord('x', x2) + tileWidth / 2);
    shape.setAttributeNS(null, "y2", coord('y', y2) + tileHeight / 2);
    shape.setAttributeNS(null, "stroke-width", "1");
    shape.setAttributeNS(null, "stroke", "blue");
    document.getElementById('viewport').appendChild(shape);

    var coordinatesArray = new Array();

    // var x1 = startCoordinates.left;
    // var y1 = startCoordinates.top;
    // var x2 = endCoordinates.left;
    // var y2 = endCoordinates.top;

    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;

    var tile = document.getElementById('tile-' + x1 + '-' + y1);
    tile.setAttribute('class', 'probed');

    while (!((x1 == x2) && (y1 == y2))) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
      // coordinatesArray.push([y1, x1]);
      tile = document.getElementById('tile-' + x1 + '-' + y1);
      tile.setAttribute('class', 'probed');
    }
    // return coordinatesArray;
  }

  // returns an array of tiles that should be visible from x, y
  pub.findVisible2 = function(sourceX, sourceY) { // DOESN'T WORK
    var tiles = document.getElementsByClassName('tile');
    var losTiles = [];
    for (var i = 0; i < tiles.length; i++) {
      if (!tiles[i].getAttribute('data-room')) {
        // targetX = tiles[i].id.match(/[0-9]+/);
        // targetY = tiles[i].id.match(/[0-9]+$/);
        // pub.drawLine(x, y, targetX, targetY);
        losTiles.push(tiles[i]);
      }
    }

    for (var i = 0; i < losTiles.length; i++) {
      var x1 = +sourceX;
      var y1 = +sourceY;
      
      var x2 = +(losTiles[i].id.match(/[0-9]+/)[0]);
      var y2 = +(losTiles[i].id.match(/[0-9]+$/)[0]);


      console.log('x1: ' + x1 + ' y1: ' + y1);
      console.log('x2: ' + x2 + ' y2: ' + y2);

      var deltaX = x2 - x1;
      if (deltaX == 0) continue;
      var deltaY = y2 - y1;
      var error = 0;
      var deltaErr = Math.abs(deltaY / deltaX);
      var y = y1;
      function mark(x, y) {
        var tile = document.getElementById('tile-' + x + '-' + y);
        if (tile && !(tile.getAttribute('data-room'))) {
          debug ? tile.style.opacity = '1' : tile.style.display = '';
          return true;
        } else {
          return false;
        }
      }
      for (var j = x1; j <= x2; j++) { // 0, 1, 2
        var blocked = false;
        if (!mark(j, y)) break;
        error = error + deltaErr;
        while (error >= 0.5) {
          if (!mark(j, y)) {
            blocked = true;
            break;
          }
          y = y + (y2 - y1 < 0 ? -1 : 1);
          error = error - 1.0;
        }
        if (blocked) break;
      }
    }
    // debug ? losTiles[i].style.opacity = '1' : losTiles[i].style.display = '';
    // pub.drawLine(0, 2, 1, 0);
    return [];
  }

  function findVisible(sourceX, sourceY) {
    var tiles = document.getElementsByClassName('tile');
    var corridorTiles = [];
    var visibleTiles = [];

    function mark(x, y) {
      var tile = document.getElementById('tile-' + x + '-' + y);
      if (tile && !(tile.getAttribute('data-room'))) {
        visibleTiles.push(tile);
        return true;
      } else {
        return false;
      }
    }

    for (var i = 0; i < tiles.length; i++) {
      if (!tiles[i].getAttribute('data-room')) corridorTiles.push(tiles[i]);
    }

    for (var i = 0; i < corridorTiles.length; i++) {
      var x1 = +sourceX, y1 = +sourceY;
      var x2 = +(corridorTiles[i].id.match(/[0-9]+/)[0]);
      var y2 = +(corridorTiles[i].id.match(/[0-9]+$/)[0]);
      var dx = Math.abs(x2 - x1);
      var dy = Math.abs(y2 - y1);
      var sx = (x1 < x2) ? 1 : -1;
      var sy = (y1 < y2) ? 1 : -1;
      var err = dx - dy;
      var x = x1, y = y1;

      if (!mark(x, y)) break;

      while (!((x == x2) && (y == y2))) {
        var e2 = err << 1;
        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }
        if (e2 < dx) {
          err += dx;
          y += sy;
        }
        if (!mark(x, y)) break;
      }
    }

    return visibleTiles;
  }

  function showVisible(player) {
    var playerX = player.getAttribute('data-x');
    var playerY = player.getAttribute('data-y');

    var id = 'tile-' + playerX + '-' + playerY;
    var tile = document.getElementById(id);

    if (roomId = tile.getAttribute('data-room')) {
      console.log(player.id + ' is in a room');
      lightRoom(roomId);
    } else {
      console.log(player.id + ' is in a corridor');

      // light visible corridor tiles and doors
      var visibleTiles = findVisible(playerX, playerY);
      for (var i = 0; i < visibleTiles.length; i++) {
        debug ? visibleTiles[i].style.opacity = '1' : visibleTiles[i].style.display = '';
        var doors = getDoors(visibleTiles[i]);
        for (var k = 0; k < doors.length; k++) {
          doors[k].style.display = '';
          debug ? doors[k].style.opacity = '1' : doors[k].style.display = '';
        }
      }
    }

    // light up enemies
    var enemies = document.getElementsByClassName('enemy');
    for (var i = 0; i < enemies.length; i++) {
      var enemyX = enemies[i].getAttribute('data-x');
      var enemyY = enemies[i].getAttribute('data-y');
      var id = 'tile-' + enemyX + '-' + enemyY;
      var tile = document.getElementById(id);
      if (debug ? tile.style.opacity == '1' : tile.style.display == '') {
        debug ? enemies[i].style.opacity = '1' : enemies[i].style.display = '';
      }
    }
  }

  pub.init = function () {
    // move unit listener
    var tiles = document.getElementsByClassName('tile');
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener('click', updateMap, false);
    }

    // draw pathfinding listeners
    // for (var i = 0; i < tiles.length; i++) {
    //   tiles[i].addEventListener('mouseover', function() {
    //     var player = document.getElementsByClassName('player')[0];
    //     var x1 = player.getAttribute('data-x');
    //     var y1 = player.getAttribute('data-y');
    //     var x2 = this.id.match(/[0-9]+/);
    //     var y2 = this.id.match(/[0-9]+$/);
    //     drawShortestPath(x1, y1, x2, y2);
    //   }, false);

    //   tiles[i].addEventListener('mouseout', function() {
    //     resetTiles();
    //   }, false);
    // }

    // door open/close listener
    var doors = document.getElementsByClassName('door');
    for (var i = 0; i < doors.length; i++) {
      doors[i].addEventListener('click', updateMap, false);
    }

    // LOS
    var players = document.getElementsByClassName('player');
    for (var i = 0; i < players.length; i++) {
      showVisible(players[i]);
    }

    makeMovementDisplay();
    if (document.getElementsByClassName('player').length > 0)
      drawRange('player-' + (+playerTurn + 1),
                document.getElementById('movement-display').innerHTML);
  }

  return pub;
}
