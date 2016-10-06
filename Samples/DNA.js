var numSteps = 20;
var width = 2;

function radians(degrees) {
  return degrees * Math.PI / 180;
}

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function red(item) {
  item.setColor(255, 0, 0);
  return item;
}

function bgA(billboard) {
  billboard.setBackgroundColor(79, 44, 108);
  return billboard;
}

function bgT(billboard) {
  billboard.setBackgroundColor(108, 44, 79);
  return billboard;
}

function bgG(billboard) {
  billboard.setBackgroundColor(0, 44, 79);
  return billboard;
}

function bgC(billboard) {
  billboard.setBackgroundColor(108, 0, 79);
  return billboard;
}

function newPhosphateItem(x, y, z) {
  var item = Space.createItem("Sphere", x, y, z);
  red(item).setScale(0.5);
  return item;
}

function newBase(left, l, x1, y1, z1, angle) {
  var offset = left ? 0 : width / 2;
  var billboard = Space.createTextBillboard(x1 + offset + width / 4, y1, z1 + 0.1);
  billboard.setLying(true);
  billboard.setTextColor(255, 255, 255);
  billboard.setSize(width / 2, 0.5);
  billboard.setFontSize(0.3);
  billboard.showPodium(false);
  billboard.setText(l);
  //billboard.rotateLocalAxis(0, 1, 0, 0, 1, 0, radians(angle), true);
  switch (l) {
    case "A":
      bgA(billboard);
      break;
    case "T":
      bgT(billboard);
      break;
    case "G":
      bgG(billboard);
      break;
    case "C":
      bgC(billboard);
      break;
  }
}

function newAT(a, x1, y1, z1, angle) {
  if (a) {
    newBase(true, "A", x1, y1, z1, angle);
    newBase(false, "T", x1, y1, z1, angle);
  } else {
    newBase(true, "T", x1, y1, z1, angle);
    newBase(false, "A", x1, y1, z1, angle);
  }
}

function newGC(a, x1, y1, z1, angle) {
  if (a) {
    newBase(true, "G", x1, y1, z1, angle);
    newBase(false, "C", x1, y1, z1, angle);
  } else {
    newBase(true, "C", x1, y1, z1, angle);
    newBase(false, "G", x1, y1, z1, angle);
  }
}

for (var i = 0; i < numSteps; i++) {
  var angle = 10 * i;
  var r = getRandom(0, 3);
  var x = Math.cos(radians(angle)) * width / 2;
  var y = Math.sin(radians(angle)) * width / 2;
  newPhosphateItem(width / 2 - x, -y, i * 0.2);
  newPhosphateItem(width / 2 + x, y, i * 0.2);
  // Space.log("X=" + x);
  switch (r) {
    case 0:
      newAT(true, width / 2 - x, -y, i * 0.2, angle);
      break;
    case 1:
      newAT(false, width / 2 - x, -y, i * 0.2, angle);
      break;
    case 2:
      newGC(true, width / 2 - x, -y, i * 0.2, angle);
      break;
    case 3:
      newGC(false, width / 2 - x, -y, i * 0.2, angle);
      break;
  }
}

Space.setRenderShadows(false);