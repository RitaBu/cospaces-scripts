//focus on the man in the center
DX.focusOn("Gj2HywVaXy", true);

//play the dog sound
DX.resource("3857c9a5612fbec76981d73e724999bba698501cbbf26e4909a0c11a47b252a2").play();

function findAnimal(name) {
  var c = undefined;
  DX.items().forEach(function (item, idx, arr) {
    if (c != undefined) {return;}
    if (item.name() == name) {
      c = [item, idx];
    }
  });
  return c;
}

var animals = ["cat", "lion", "elephant", "camel", "dog", "mouse", "horse", "snake"];
var currentTask = -1;

animals.forEach(function(el) {
  var itemData = findAnimal(el);
  if (itemData !== undefined) {
    var item = itemData[0];
    var itemIdx = itemData[1];
    item.activate(function () {
      if (currentTask === itemIdx) {
        DX.log("Correct");
        currentTask++;
        if (currentTask === animals.length) {
          DX.log("Game over");
          DX.end();
        }
      } else {
        DX.log("Incorrect");
      }
    });
  }
});

currentTask++;
