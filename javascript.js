function coord(axis, value) {
  if (axis == "x") {
    return (viewportWidth / 2 - tileWidth * (map[0].length / 2)
      + (tileWidth + 1) * value);
  } else if (axis == "y") {
    return (viewportHeight / 2 - tileHeight * (map.length / 2)
      + (tileHeight + 1) * value);
  } else {
    console.log("Axis " + axis + "not recognized.");
  }
}

function makeRectangle(x, y) {
  var svgns = "http://www.w3.org/2000/svg";
  var svgDocument = document.getElementById('viewport').ownerDocument;

  var shape = svgDocument.createElementNS(svgns, "rect");
  shape.setAttributeNS(null, "x", coord('x', x));
  shape.setAttributeNS(null, "y", coord('y', y));
  shape.setAttributeNS(null, "width",  tileWidth);
  shape.setAttributeNS(null, "height", tileHeight);
  shape.setAttributeNS(null, "class", "tile");
  shape.setAttributeNS(null, "id", "tile-" + x + "-" + y);
  
  document.getElementById('viewport').appendChild(shape);
}

function makeRoom(x1, y1, x2, y2) {
  var svgns = "http://www.w3.org/2000/svg";
  var svgDocument = document.getElementById('viewport').ownerDocument;

  var shape = svgDocument.createElementNS(svgns, "rect");
  shape.setAttributeNS(null, "x", coord('x', Math.min(x1, x2)));
  shape.setAttributeNS(null, "y", coord('y', Math.min(y1, y2)));
  shape.setAttributeNS(null, "width",
    (Math.abs(x1 - x2) + 1) * (tileWidth + 1) - 1);
  shape.setAttributeNS(null, "height",
    (Math.abs(y1 - y2) + 1) * (tileHeight + 1) - 1);
  shape.setAttributeNS(null, "class", "room");
  // shape.setAttributeNS(null, "id", "");
  
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

function makeUnit(x, y) {
  var svgns = "http://www.w3.org/2000/svg";
  var svgDocument = document.getElementById('viewport').ownerDocument;
  var target = document.getElementById('tile-' + x + '-' + y);
  var cx = target.x.baseVal.value;
  var cy = target.y.baseVal.value;

  var shape = svgDocument.createElementNS(svgns, "circle");
  shape.setAttributeNS(null, "cx", cx + tileWidth / 2);
  shape.setAttributeNS(null, "cy", cy + tileHeight / 2);
  shape.setAttributeNS(null, "r", "10");
  shape.setAttributeNS(null, "fill-opacity", "1");
  shape.setAttributeNS(null, "fill", '#c66666');
  shape.setAttributeNS(null, "stroke-width", "2");
  shape.setAttributeNS(null, "stroke", "maroon");
  // shape.setAttributeNS(null, "class", "");
  shape.setAttributeNS(null, "id", "player");
  shape.setAttributeNS(null, "data-x", x);
  shape.setAttributeNS(null, "data-y", y);

  document.getElementById('viewport').appendChild(shape);
}

function makeMark(x, y) {
  var svgns = "http://www.w3.org/2000/svg";
  var svgDocument = document.getElementById('viewport').ownerDocument;
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

function makeDoor(x1, y1, x2, y2, state = 'closed') {
  // TODO: test to make sure tiles are adjacent
  var svgns = "http://www.w3.org/2000/svg";
  var svgDocument = document.getElementById('viewport').ownerDocument;
  var orientation = 'horizontal';
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
  if (state == 'open')
    shape.setAttributeNS(null, "stroke", "green");
  else
    shape.setAttributeNS(null, "stroke", "red");

  document.getElementById('viewport').appendChild(shape);
}

function moveUnit(id, x, y) {
  var unit = document.getElementById(id);
  var target = document.getElementById('tile-' + x + '-' + y);
  var cx = target.x.baseVal.value;
  var cy = target.y.baseVal.value;
  unit.setAttributeNS(null, "cx", cx + tileWidth / 2);
  unit.setAttributeNS(null, "cy", cy + tileHeight / 2);
  unit.setAttributeNS(null, "data-x", x);
  unit.setAttributeNS(null, "data-y", y);
}

// from en.wikipedia.org/wiki/Breadth-first_search#Pseudocode
function bfs(x, y) {
  var target = document.getElementById('tile-' + x + '-' + y);
  var q = [], id;
  q.push([x, y]);
  target.style.stroke = "green";
  target.style.fill = "#CCFFCC";
  while(q.length !== 0) {
    var v = q.shift();
    target = document.getElementById('tile-' + v[0] + '-' + v[1]);
    // north
    id = 'tile-' + v[0] + '-' + (v[1] - 1);
    if (target = document.getElementById(id)) {
      if (target.style.stroke !== "green") {
        q.push([v[0], v[1] - 1]);
        target.style.stroke = "green";
        target.style.fill = "#CCFFCC";
      }
    }
    // south
    id = 'tile-' + v[0] + '-' + (v[1] + 1);
    if (target = document.getElementById(id)) {
      if (target.style.stroke !== "green") {
        q.push([v[0], v[1] + 1]);
        target.style.stroke = "green";
        target.style.fill = "#CCFFCC";
      }
    }
    // east
    id = 'tile-' + (v[0] + 1) + '-' + v[1];
    if (target = document.getElementById(id)) {
      if (target.style.stroke !== "green") {
        q.push([v[0] + 1, v[1]]);
        target.style.stroke = "green";
        target.style.fill = "#CCFFCC";
      }
    }
    // west
    id = 'tile-' + (v[0] - 1) + '-' + v[1];
    if (target = document.getElementById(id)) {
      if (target.style.stroke !== "green") {
        q.push([v[0] - 1, v[1]]);
        target.style.stroke = "green";
        target.style.fill = "#CCFFCC";
      }
    }
  }
}

// slowed down version of bfs with range
function bfsSlow(x, y, range = 5) {
  var target = document.getElementById('tile-' + x + '-' + y);
  var q = [];
  q.push([x, y, 0]);
  target.style.stroke = "green";
  target.style.fill = "#CCFFCC";
  (function step() {
    if (q.length !== 0) {
      var v = q.shift(), id;
      // north
      id = 'tile-' + v[0] + '-' + (v[1] - 1);
      if (target = document.getElementById(id)) {
        if (target.style.stroke !== "green" && v[2] < range) {
          q.push([v[0], v[1] - 1, v[2] + 1]);
          target.style.stroke = "green";
          target.style.fill = "#CCFFCC";
        }
      }
      // south
      id = 'tile-' + v[0] + '-' + (v[1] + 1);
      if (target = document.getElementById(id)) {
        if (target.style.stroke !== "green" && v[2] < range) {
          q.push([v[0], v[1] + 1, v[2] + 1]);
          target.style.stroke = "green";
          target.style.fill = "#CCFFCC";
        }
      }
      // east
      id = 'tile-' + (v[0] + 1) + '-' + v[1];
      if (target = document.getElementById(id)) {
        if (target.style.stroke !== "green" && v[2] < range) {
          q.push([v[0] + 1, v[1], v[2] + 1]);
          target.style.stroke = "green";
          target.style.fill = "#CCFFCC";
        }
      }
      // west
      id = 'tile-' + (v[0] - 1) + '-' + v[1];
      if (target = document.getElementById(id)) {
        if (target.style.stroke !== "green" && v[2] < range) {
          q.push([v[0] - 1, v[1], v[2] + 1]);
          target.style.stroke = "green";
          target.style.fill = "#CCFFCC";
        }
      }
      setTimeout(step, 250);
    }
  })();
}

function sameRoom(node, target) {
  var node_room = node.getAttribute('data-room');
  return node_room == target.getAttribute('data-room');
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