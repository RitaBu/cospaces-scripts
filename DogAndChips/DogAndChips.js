var size = 10;

var items = Space.items();
for (var k = 0; k < items.length; k++) {
  items[k].remove();
}

var dog = Space.createItem("LP_Dog", 0, 0, 1);
dog.setColor(162, 42, 42);

function jump(x, y) {
  return function () {
    dog.throwTo(x, y, 0, 1, function () {
      dog.animateToState("StandHowl");
      dog.animateToState("StandHowl");
    });
  }
}

for (var i = 0; i < size; i++) {
  for (var j = 0; j < size; j++) {
    var chip = Space.createItem("CheckerChip", i * 2 - size + 1, j * 2 - size + 1, -0.2);
    chip.setScale(2);
    chip.setColor(0, 128, 0);
    chip.activate(jump(i * 2 - size + 1, j * 2 - size + 1));
  }
}
