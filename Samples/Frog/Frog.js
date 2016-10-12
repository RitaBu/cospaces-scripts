define(['../Eyes/EyedObject'], function (EyedObject) {
  var Frog = function (item) {
    this.item = item;
    this.eyedObject = new EyedObject(this.item);
  };

  Frog.prototype.update = function() {
    this.eyedObject.update();
  };

  Frog.prototype.blink = function () {
    this.eyedObject.blink();
  };

  Frog.prototype.lookLeft = function () {
    this.eyedObject.left();
  };

  Frog.prototype.lookRight = function () {
    this.eyedObject.right();
  };

  return Frog;
});
