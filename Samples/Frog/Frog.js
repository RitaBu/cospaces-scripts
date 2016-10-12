define(['../Eyes/EyedObject', './AnimatedTongue'], function (EyedObject, AnimatedTongue) {
  var Frog = function (item) {
    this.item = item;
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
    Project.log("Frog.tongueToggle");
    this.tongue.toggle();
  };

  return Frog;
});
