//focus on the man in the center
DX.focusOn("Gj2HywVaXy", true);

//play the dog sound
DX.resource("3857c9a5612fbec76981d73e724999bba698501cbbf26e4909a0c11a47b252a2").play();

function findAnimal(name) {
  DX.items().forEach(function (item) {
    if (item.name() === name) return item;
  })
  return undefined;
}

var animals = ["cat", "lion", "elephant", "camel", "dog", "mouse", "horse", "snake"];
animals.forEach(function(el) {
  var item = findAnimal(el);
  if (item !== undefined) {
    item.activate(function () {
      DX.log("Activated " + item.name());
    });
  }
});
