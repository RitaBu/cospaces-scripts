define(['../Eyes/EyedObject', './AnimatedTongue'], function (EyedObject, AnimatedTongue) {
  var Frog = function (item) {
    this.item = item;
    this.eyedObject = new EyedObject(this.item);
    this.tongue = new AnimatedTongue(this.item.part("Tongue"));
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
