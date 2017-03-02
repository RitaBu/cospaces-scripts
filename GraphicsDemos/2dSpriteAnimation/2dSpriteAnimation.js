/**
 * SpriteAnimation constructor function
 *
 */
function SpriteAnimation(sequence, options) {
  this.opt = options;
  this.seq = sequence;
  this.pos = sequence[0].getPosition();
  this.orientQuat = sequence[0].getOrientationQuat();
  this.cam = Scene.getItem(options.camId);
  this.init();
  this.run();
}

SpriteAnimation.prototype.init = function () {
  for (var i = 0; i < this.seq.length; i++) {
    this.seq[i].setPositionQuat(this.pos.x, this.pos.y, this.pos.z, this.orientQuat.x, this.orientQuat.y, this.orientQuat.z, this.orientQuat.w);
  }
};

SpriteAnimation.prototype.run = function () {
  var self = this;
  var index = 0;
  Scene.scheduleRepeating(function () {
    for (var i = 0; i < self.seq.length; i++) {
      if (self.opt.faceToCam) self.seq[i].faceTo(self.cam);
      if (index % self.seq.length === i) {
        self.seq[i].setScale(1);
      } else {
        self.seq[i].setScale(0);
      }
    }
    index++;
  }, 1 / self.opt.fps);
};

// Instantiate animations
new SpriteAnimation([
  Scene.getItem('2jZVIWi8e7'),
  Scene.getItem('3bbFixClSR'),
  Scene.getItem('C36CuTPxNq'),
  Scene.getItem('6o8uZz1Mv0'),
  Scene.getItem('eEWWjDk82a'),
  Scene.getItem('ffHOwub6I3'),
  Scene.getItem('JYJbZrQ9oT'),
  Scene.getItem('rUrGkC9Nhb'),
  Scene.getItem('WytXtNM1CZ'),
  Scene.getItem('TSeY8Ejyd6'),
  Scene.getItem('05V9ouBzL8'),
  Scene.getItem('n332vnV6te')
], {
  camId: 'or5v4PSMZB',
  faceToCam: false,
  fps: 24
});

new SpriteAnimation([
  Scene.getItem('Q82s4bdF3o'),
  Scene.getItem('AcK8Y16R1j'),
  Scene.getItem('rUFdfwgHqA'),
  Scene.getItem('buI4y007BY')
], {
  camId: 'or5v4PSMZB',
  faceToCam: true,
  fps: 10
});
