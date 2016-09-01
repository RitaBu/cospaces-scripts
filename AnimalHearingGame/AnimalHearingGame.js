//focus on the man in the center
DX.focusOn("Gj2HywVaXy", true);

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
var animalSounds = [
  "adcc795ae4e726a98e58c8fab6e0e388666092ff4332e7f4cd0f69165549a54b",
  "lion",
  "3c1f08fc1ec0f02c149e46c497c4decef961188b1f17beed75e1aef95c81aae0",
  "a312a82af35e65faa83cd3ec17f0443958cd5be23c9a66738d7e4fc17087193c",
  "3857c9a5612fbec76981d73e724999bba698501cbbf26e4909a0c11a47b252a2",
  "23760f9ad986a00e2319466c29e5982823796e0b695ded5ebcfc3bf07ad3d40e",
  "bd0166e10f6cb7fd5676d348ce6a3027f0dedea15a7ebb5e638c1c68f8d20be1",
  "5c0cd4337709ebde553080656e51ef173326d1dfad041aac3e634ff089ed6a55"
];
var currentTask = -1;

animals.forEach(function(el) {
  var itemData = findAnimal(el);
  if (itemData !== undefined) {
    var item = itemData[0];
    var itemIdx = itemData[1];
    item.activate(function () {
      if (currentTask === itemIdx) {
        DX.log("Correct");
        if (!nextTask()) {
          DX.log("Game over");
          DX.end();
        }
      } else {
        DX.log("Incorrect");
      }
    });
  }
});

function nextTask() {
  currentTask++;

  DX.resource(animalSounds[currentTask]).play();

  return (currentTask === animals.length);
}

nextTask();