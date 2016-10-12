define(['../Eyes/EyedObject', './AnimatedTongue'], function (EyedObject, AnimatedTongue) {
  var Frog = function (item) {
    this.item = item;
    Space.setMood(0.5);
    this.eyedObject = new EyedObject(this.item);
    this.tongue = new AnimatedTongue(this.item.getPart("Tongue"));
  };

  Frog.prototype.update = function() {
    this.eyedObject.update();
    this.tongue.update();
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

  Frog.prototype.tongueToggle = function () {
    this.tongue.toggle();
  };

  return Frog;
});
