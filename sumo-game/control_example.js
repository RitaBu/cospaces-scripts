var personId = DX.createPerson("MASCULINE", "ADULT", 0, 0);
DX.focusOn(personId, true);
DX.setControlEnabled(false);

DX.log("test log");

var forward = false;

DX.command(function(cmd) {
  DX.log("cmd: " + cmd);
  if(cmd == 10) {
    forward = false;
  } else {
    forward = true;
  }
});

var onEnterFrame = function(dt){
  if(forward) {
    var person = DX.item(personId);
    var position = person.position();
    person.nonDiscreteTeleport(position[0] + 0.02, position[1], position[2]);
  }
  DX.runLater(onEnterFrame, 0.01)
}
DX.runLater(onEnterFrame, 0.01);

