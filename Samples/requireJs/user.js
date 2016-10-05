require(["lib/lib2"], function(lib2) {
  var man = Space.createItem("LP_Man", 0, 0, 0);
  man.say(new lib2().getName());
});

